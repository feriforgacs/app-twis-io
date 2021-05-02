import Cors from "cors";
import { getSession } from "next-auth/client";
import { addMonths } from "date-fns";
import axios from "axios";
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

export default async function SubscriptionUpdateRequest(req, res) {
	await cors(req, res);

	const authStatus = await AuthCheck(req, res);
	if (!authStatus) {
		return res.end();
	}

	await DatabaseConnect();
	const session = await getSession({ req });

	const subscriptionId = req.body.subscriptionId;
	if (!subscriptionId) {
		return res.status(400).json({ success: false, error: "missing subscriptionId value" });
	}

	const plan = req.body.plan;
	if (!plan) {
		return res.status(400).json({ success: false, error: "missing plan value" });
	}

	const planTerm = req.body.planTerm;
	if (!planTerm) {
		return res.status(400).json({ success: false, error: "missing planTerm value" });
	}

	const productId = req.body.productId;
	if (!productId) {
		return res.status(400).json({ success: false, error: "missing productId value" });
	}

	let overagesPrice = 0;
	let monthlyFee = 0;

	if (plan === "basic") {
		overagesPrice = process.env.NEXT_PUBLIC_PRICE_BASIC_OVERAGES;
		if (planTerm === "monthly") {
			monthlyFee = process.env.NEXT_PUBLIC_PRICE_BASIC_MONTHLY;
		} else {
			monthlyFee = process.env.NEXT_PUBLIC_PRICE_BASIC_YEARLY;
		}
	} else if (plan === "pro") {
		overagesPrice = process.env.NEXT_PUBLIC_PRICE_PRO_OVERAGES;
		if (planTerm === "monthly") {
			monthlyFee = process.env.NEXT_PUBLIC_PRICE_PRO_MONTHLY;
		} else {
			monthlyFee = process.env.NEXT_PUBLIC_PRICE_PRO_YEARLY;
		}
	} else if (plan === "premium") {
		overagesPrice = process.env.NEXT_PUBLIC_PRICE_PREMIUM_OVERAGES;
		if (planTerm === "monthly") {
			monthlyFee = process.env.NEXT_PUBLIC_PRICE_PREMIUM_MONTHLY;
		} else {
			monthlyFee = process.env.NEXT_PUBLIC_PRICE_PREMIUM_YEARLY;
		}
	}

	/**
	 * Update subscription on Paddle
	 */
	try {
		const updateRequest = await axios.post(
			`${process.env.PADDLE_API_ENDPOINT}subscription/users/update`,
			{
				vendor_id: process.env.NEXT_PUBLIC_PADDLE_VENDOR_ID,
				vendor_auth_code: process.env.PADDLE_AUTH_CODE,
				subscription_id: subscriptionId,
				quantity: 1,
				plan_id: productId,
			},
			{
				headers: {
					"Content-Type": "application/json",
				},
			}
		);

		if (!updateRequest.data.success) {
			return res.status(400).json({ success: false });
		}
	} catch (error) {
		console.log(error);
		return res.status(400).json({ success: false, error: error });
	}

	/**
	 * Update subscription in the db
	 */
	let subscription;
	try {
		subscription = await Subscription.findOneAndUpdate({ userId: session.user.id }, { monthlyFee, overagesPrice, plan, planTerm, productId, updatedAt: Date.now() }, { new: true });

		if (!subscription) {
			return res.status(400).json({ success: false, error: "can't update subscription document in the db" });
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

		let usageLimit = 10;
		if (plan === "basic") {
			usageLimit = process.env.NEXT_PUBLIC_BASIC_LIMIT;
		} else if (plan === "pro") {
			usageLimit = process.env.NEXT_PUBLIC_PRO_LIMIT;
		} else if (plan === "premium") {
			usageLimit = process.env.NEXT_PUBLIC_PREMIUM_LIMIT;
		}

		let limitReached = null;
		if (usage.value >= usageLimit) {
			// user creates subscription or upgrades account, but already had overages
			// eg limit was 100, but collected 1100 participants » upgrades to 1000 participants / month » already reached the limit
			limitReached = Date.now();
		}

		let renewDate = addMonths(new Date(Date.now()), 1);
		const updatedUsage = await Usage.findOneAndUpdate(
			{ _id: usage._id },
			{
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

		return res.status(200).json({ success: true, subscription: subscription });
	} catch (error) {
		console.log(error);
		return res.status(400).json({ success: false, error: error });
	}
}
