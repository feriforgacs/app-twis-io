import Cors from "cors";
import { getSession } from "next-auth/client";
import initMiddleware from "../../../lib/InitMiddleware";
import AuthCheck from "../../../lib/AuthCheck";
import DatabaseConnect from "../../../lib/DatabaseConnect";
import Subscription from "../../../models/Subscription";

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
				state: "active",
				overagesPrice,
			},
			{ upsert: true, new: true, setDefaultsOnInsert: true }
		);

		if (!subscription) {
			return res.status(400).json({ success: false, error: "can't create or update subscription" });
		}

		return res.status(200).json({ success: true });
	} catch (error) {
		console.log(error);
		return res.status(400).json({ success: false, error: error });
	}

	/**
	 * @todo Update usage in the db
	 */
}
