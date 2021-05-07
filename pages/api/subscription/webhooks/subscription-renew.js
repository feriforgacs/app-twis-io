import crypto from "crypto";
import { serialize } from "php-serialize";
import Cors from "cors";
import initMiddleware from "../../../../lib/InitMiddleware";
import DatabaseConnect from "../../../../lib/DatabaseConnect";
import Subscription from "../../../../models/Subscription";
import Usage from "../../../../models/Usage";

const cors = initMiddleware(
	Cors({
		methods: ["POST"],
	})
);

export default async function SubscriptionRenewRequest(req, res) {
	await cors(req, res);
	await DatabaseConnect();

	console.log("itt van");

	if (validateWebhook(req.body)) {
		return res.status(200).json({ success: true });
	} else {
		return res.status(403).json({ success: false });
	}
}

const pubKey = Buffer.from(process.env.PADDLE_PUBKEY, "base64");

console.log(pubKey);

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
		if (jsonObj.hasOwnProperty(property) && typeof jsonObj[property] !== "string") {
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
