import Cors from "cors";
import { getSession } from "next-auth/client";
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

	const subscriptionId = req.body.subscriptionId;
	if (!subscriptionId) {
		return res.status(400).json({ success: false, error: "missing subscriptionId value" });
	}

	const orderId = req.body.orderId;
	if (!orderId) {
		return res.status(400).json({ success: false, error: "missing orderId value" });
	}

	const plan = req.body.plan;
	if (!plan) {
		return res.status(400).json({ success: false, error: "missing plan value" });
	}

	const planTerm = req.body.planTerm;
	if (!planTerm) {
		return res.status(400).json({ success: false, error: "missing planTerm value" });
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
	 * Create subscription document in the db or update existing one
	 */
	let subscription;
	try {
		subscription = await Subscription.findOneAndUpdate(
			{ userId: session.user.id },
			{
				customerId,
				paymentDate: Date.now(),
				checkoutId,
				productId,
				subscriptionId,
				orderId,
				status: "active",
				plan,
				planTerm,
				monthlyFee,
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

		let usageLimit = 10;
		if (plan === "basic") {
			usageLimit = process.env.NEXT_PUBLIC_BASIC_LIMIT;
		} else if (plan === "pro") {
			usageLimit = process.env.NEXT_PUBLIC_PRO_LIMIT;
		} else if (plan === "premium") {
			usageLimit = process.env.NEXT_PUBLIC_PREMIUM_LIMIT;
		}

		const updatedUsage = await Usage.findOneAndUpdate(
			{ _id: usage._id },
			{
				limit: usageLimit,
				updatedAt: Date.now(),
			}
		);

		if (!updatedUsage) {
			return res.status(400).json({ success: false, error: "can't update usage data in the db" });
		}

		return res.status(200).json({ success: true, subscription });
	} catch (error) {
		console.log(error);
		return res.status(400).json({ success: false, error: error });
	}
}
