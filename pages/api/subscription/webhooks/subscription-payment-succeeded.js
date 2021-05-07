import crypto from "crypto";
import { serialize } from "php-serialize";
import Cors from "cors";
import initMiddleware from "../../../../lib/InitMiddleware";
import DatabaseConnect from "../../../../lib/DatabaseConnect";
import Subscription from "../../../../models/Subscription";
import Usage from "../../../../models/Usage";

const pubKey = Buffer.from(process.env.PADDLE_PUBKEY, "base64");

const cors = initMiddleware(
	Cors({
		methods: ["POST"],
	})
);

export default async function SubscriptionPaymentSucceeded(req, res) {
	await cors(req, res);
	await DatabaseConnect();

	// validate request
	if (!validateWebhook(req.body)) {
		console.log("invalid webhook request");
		return res.status(403).json({ success: false, error: "invalid request" });
	}

	// get data from request
	const { alert_name, checkout_id, next_bill_date, order_id, subscription_id, user_id } = req.body;

	// check webhook
	if (!alert_name || alert_name !== "subscription_payment_succeeded") {
		return res.status(403).json({ success: false, error: "alert name missing or invalid" });
	}

	// update subscription in the db
	let subscription;
	try {
		subscription = await Subscription.findOneAndUpdate(
			{ subscriptionId: subscription_id, customerId: user_id },
			{
				checkoutId: checkout_id,
				orderId: order_id,
				paymentDate: Date.now(),
				updatedAt: Date.now(),
			},
			{ new: true }
		);

		if (!subscription) {
			return res.status(400).json({ success: false, error: `couldn't find subscription in the db subscriptionId: ${subscription_id} userId: ${user_id}` });
		}
	} catch (error) {
		console.log(error);
		return res.status(400).json({ success: false, error: error });
	}

	// update usage in the db
	try {
		let usageValue = 0;
		if (subscription.usage.trialAccount && subscription.usage.value > 10) {
			// decrease usage value by trial usage limit
			usageValue = subscription.usage.value - 10;
		} else if (subscription.usage.value > subscription.usage.limit) {
			// user upgrades, downgrades account, but already reached the usage limit, keep overages
			// eg, limit was 100, but collected 130 participants » keep 30 participants
			usageValue = subscription.usage.value - subscription.usage.limit;
		}

		const limitReached = usageValue > subscription.usage.limit ? Date.now() : null;

		const usage = await Usage.findOneAndUpdate(
			{ userId: subscription.usage.userId },
			{
				value: usageValue,
				trialAccount: false,
				renewDate: new Date(next_bill_date),
				limitReached,
				updatedAt: Date.now(),
			}
		);

		if (!usage) {
			return res.status(400).json({ success: false, error: `couldn't update usage userId: ${subscription.usage.userId}` });
		}
	} catch (error) {
		console.log(error);
		return res.status(400).json({ success: false, error: error });
	}

	return res.status(200).json({ success: true });
}

function ksort(obj) {
	const keys = Object.keys(obj).sort();
	let sortedObj = {};
	for (let i in keys) {
		sortedObj[keys[i]] = obj[keys[i]];
	}
	return sortedObj;
}

function validateWebhook(jsonObj) {
	// Grab p_signature
	const mySig = Buffer.from(jsonObj.p_signature, "base64");
	// Remove p_signature from object - not included in array of fields used in verification.
	delete jsonObj.p_signature;
	// Need to sort array by key in ascending order
	jsonObj = ksort(jsonObj);
	for (let property in jsonObj) {
		if (Object.prototype.hasOwnProperty.call(jsonObj, property) && typeof jsonObj[property] !== "string") {
			if (Array.isArray(jsonObj[property])) {
				// is it an array
				jsonObj[property] = jsonObj[property].toString();
			} else {
				//if its not an array and not a string, then it is a JSON obj
				jsonObj[property] = JSON.stringify(jsonObj[property]);
			}
		}
	}
	// Serialise remaining fields of jsonObj
	const serialized = serialize(jsonObj);
	// verify the serialized array against the signature using SHA1 with your public key.
	const verifier = crypto.createVerify("sha1");
	verifier.update(serialized);
	verifier.end();

	const verification = verifier.verify(pubKey, mySig);
	// Used in response if statement
	return verification;
}
