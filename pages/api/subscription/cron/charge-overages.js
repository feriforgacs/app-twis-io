import Cors from "cors";
import axios from "axios";
import { addMonths } from "date-fns";
import SendAdminNotification from "../../../../lib/AdminNotification";
import initMiddleware from "../../../../lib/InitMiddleware";
import DatabaseConnect from "../../../../lib/DatabaseConnect";
import Usage from "../../../../models/Usage";
import Subscription from "../../../../models/Subscription";

const cors = initMiddleware(
	Cors({
		methods: ["GET"],
	})
);

export default async function ChargeOveragesHandler(req, res) {
	await cors(req, res);
	await DatabaseConnect();

	/**
	 * Get usage where overages exists
	 */
	try {
		const endOfToday = new Date(Date.now()).setHours(23, 59, 59, 59);
		let overages = await Usage.find({ $expr: { $gt: ["value", "limit"] } })
			.and({ renewDate: { $lte: endOfToday } })
			.and({ trialAccount: false })
			.distinct("userId");

		/**
		 * There are no subscriptions with overages that should be charged today
		 */
		if (overages.length <= 0) {
			return res.status(200).send("no overages to charge today");
		}

		// get subscriptions
		const subscriptions = await Subscription.find({ userId: { $in: overages }, status: "active" });

		if (subscriptions.length <= 0) {
			return res.status(200).send("no active subscriptions found for overages");
		}

		// calculate overages costs and initiate extra charge
		for (const subscription of subscriptions) {
			const overagesAmount = subscription.usage.value - subscription.usage.limit;
			const overagesCost = subscription.overagesPrice * overagesAmount;
			const renewDate = addMonths(new Date(Date.now()), 1);

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
					// send notification about overages charge error to admin
					SendAdminNotification(`⚠️ Unable to charge overages`, `User ID: ${subscription.userId} Subscription ID: ${subscription.subscriptionId}`);
					/**
					 * @todo send notification to user
					 */
				} else {
					// reset usage
					await Usage.findOneAndUpdate({ _id: subscription.usage._id }, { value: 0, renewDate, limitReached: null, updatedAt: Date.now() });
				}
			} else {
				// fair usage - if the overages wasn't that high, we just reset the usage to zero
				await Usage.findOneAndUpdate({ _id: subscription.usage._id }, { value: 0, renewDate, limitReached: null, updatedAt: Date.now() });
			}
		}

		return res.status(200).json({ success: true });
	} catch (error) {
		console.log(error);
		return res.status(400).json({ success: false, error });
	}
}
