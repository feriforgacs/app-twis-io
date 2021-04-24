import Cors from "cors";
import { getSession } from "next-auth/client";
import { addMonths } from "date-fns";
import initMiddleware from "../../../lib/InitMiddleware";
import AuthCheck from "../../../lib/AuthCheck";
import DatabaseConnect from "../../../lib/DatabaseConnect";
import Subscription from "../../../models/Subscription";
import Usage from "../../../models/Usage";

const cors = initMiddleware(
	Cors({
		methods: ["POST"],
	})
);

export default async function SubscriptionCreateRequest(req, res) {
	await cors(req, res);

	const authStatus = await AuthCheck(req, res);
	if (!authStatus) {
		return res.end();
	}

	await DatabaseConnect();
	const session = await getSession({ req });

	const checkoutId = req.body.checkoutId;
	if (!checkoutId) {
		return res.status(400).json({ success: false, error: "missing checkoutId value" });
	}

	const customerId = req.body.customerId;
	if (!customerId) {
		return res.status(400).json({ success: false, error: "missing customerId value" });
	}

	const productId = req.body.productId;
	if (!productId) {
		return res.status(400).json({ success: false, error: "missing productId value" });
	}

	const plan = req.body.plan;
	if (!plan) {
		return res.status(400).json({ success: false, error: "missing plan value" });
	}

	let overagesPrice = 0;
	if (plan === "basic") {
		overagesPrice = process.env.NEXT_PUBLIC_PRICE_BASIC_OVERAGES;
	} else if (plan === "pro") {
		overagesPrice = process.env.NEXT_PUBLIC_PRICE_PRO_OVERAGES;
	} else if (plan === "premium") {
		overagesPrice = process.env.NEXT_PUBLIC_PRICE_PREMIUM_OVERAGES;
	}

	/**
	 * Create subscription document in the db or update existing one
	 */
	try {
		const subscription = await Subscription.findOneAndUpdate(
			{ userId: session.user.id },
			{
				customerId,
				paymentDate: Date.now(),
				checkoutId,
				productId,
				status: "active",
				overagesPrice,
			},
			{ upsert: true, new: true, setDefaultsOnInsert: true }
		);

		if (!subscription) {
			return res.status(400).json({ success: false, error: "can't create or update subscription" });
		}
	} catch (error) {
		console.log(error);
		return res.status(400).json({ success: false, error: error });
	}

	/**
	 * Update usage in the db
	 */
	try {
		const usage = await Usage.findOne({ userId: session.user.id });

		if (!usage) {
			return res.status(400).json({ success: false, error: "can't get usage data from the db" });
		}

		let usageValue = 0;
		// decrease usage value by trial usage limit
		if (usage.trialAccount) {
			usageValue = usage.value - 10;
		}

		let usageLimit = 10;
		if (plan === "basic") {
			usageLimit = process.env.NEXT_PUBLIC_BASIC_LIMIT;
		} else if (plan === "pro") {
			usageLimit = process.env.NEXT_PUBLIC_PRO_LIMIT;
		} else if (plan === "premium") {
			usageLimit = process.env.NEXT_PUBLIC_PREMIUM_LIMIT;
		}

		let limitReached = null;
		if (usageValue >= usageLimit) {
			limitReached = Date.now();
		}

		let renewDate = addMonths(new Date(Date.now()), 1);
		const updatedUsage = await Usage.findOneAndUpdate(
			{ _id: usage._id },
			{
				value: usageValue,
				limit: usageLimit,
				trialAccount: false,
				renewDate,
				limitReached,
				updatedAt: Date.now(),
			}
		);

		if (!updatedUsage) {
			return res.status(400).json({ success: false, error: "can't update usage data in the db" });
		}

		return res.status(200).json({ success: true });
	} catch (error) {
		console.log(error);
		return res.status(400).json({ success: false, error: error });
	}
}
