import Cors from "cors";
import { getSession } from "next-auth/client";
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

export default async function CancelSubscriptionHandler(req, res) {
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

	// check overages
	try {
		const subscriptionPromise = Subscription.findOne({ userId: session.user.id, status: "active" });
		const usagePromise = Usage.findOne({ userId: session.user.id });

		const [subscription, usage] = await Promise.all([subscriptionPromise, usagePromise]);
		if (subscription) {
			// check usage overages
			if (usage && usage.value > usage.limit) {
				// overages apply
				const overagesAmount = subscription.usage.value - subscription.usage.limit;
				const overagesCost = subscription.overagesPrice * overagesAmount;

				// only charge overages above X dollars
				if (overagesCost >= process.env.OVERAGES_FAIR_LIMIT) {
					const overagesChargeResult = await axios.post(
						`${process.env.PADDLE_API_ENDPOINT}subscription/${subscription.subscriptionId}/charge`,
						{
							vendor_id: process.env.NEXT_PUBLIC_PADDLE_VENDOR_ID,
							vendor_auth_code: process.env.PADDLE_AUTH_CODE,
							amount: overagesCost,
							charge_name: `twis.io - ${subscription.plan} plan monthly overages`,
							passthrough: "overagescharge",
						},
						{
							headers: {
								"Content-Type": "application/json",
							},
						}
					);

					if (!overagesChargeResult.data.success) {
						// couldn't charege overages
						return res.status(400).json({ success: false });
					}
				}
			}
		}
	} catch (error) {
		console.log(error);
		return res.status(400).json({ success: false, error: error });
	}

	try {
		const cancelRequest = await axios.post(
			`${process.env.PADDLE_API_ENDPOINT}subscription/users_cancel`,
			{
				vendor_id: process.env.NEXT_PUBLIC_PADDLE_VENDOR_ID,
				vendor_auth_code: process.env.PADDLE_AUTH_CODE,
				subscription_id: subscriptionId,
			},
			{
				headers: {
					"Content-Type": "application/json",
				},
			}
		);

		if (!cancelRequest.data.success) {
			return res.status(400).json({ success: false });
		}
	} catch (error) {
		console.log(error);
		return res.status(400).json({ success: false, error: error });
	}

	/**
	 * Update subscription in the db to cancelled
	 */
	try {
		const subscriptionUpdate = await Subscription.findOneAndUpdate({ userId: session.user.id }, { status: "cancelled", updatedAt: Date.now() });

		if (!subscriptionUpdate) {
			return res.status(400).json({ success: false, error: "can't update subscription document in the db" });
		}
	} catch (error) {
		console.log(error);
		return res.status(400).json({ success: false, error: error });
	}

	/**
	 * Update usage to trial
	 */
	try {
		const usageUpdate = await Usage.findOneAndUpdate({ userId: session.user.id }, { trialAccount: true, updatedAt: Date.now() });

		if (!usageUpdate) {
			return res.status(400).json({ success: false, error: "can't update usage document in the db" });
		}
	} catch (error) {
		console.log(error);
		return res.status(400).json({ success: false, error: error });
	}

	return res.status(200).json({ success: true });
}
