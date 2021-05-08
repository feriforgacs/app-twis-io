import Cors from "cors";
import axios from "axios";
import { addMonths } from "date-fns";
import initMiddleware from "../../../lib/InitMiddleware";
import DatabaseConnect from "../../../lib/DatabaseConnect";
import Usage from "../../../models/Usage";
import Subscription from "../../../models/Subscription";

const cors = initMiddleware(
	Cors({
		methods: ["GET"],
	})
);

export default async function ChargeOveragesHandler(req, res) {
	await cors(req, res);
	await DatabaseConnect();

	// get extra usage from the database
	try {
		let overages = await Usage.find({ $expr: { $gt: ["value", "limit"] } })
			.and({ renewDate: { $lte: new Date(Date.now()) } })
			.and({ trialAccount: false })
			.distinct("userId");

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

			// only charge overages above 3 dollars
			if (overagesCost >= 3) {
				const overagesChargeResult = await axios.post(
					`${process.env.PADDLE_API_ENDPOINT}subscription/${subscription.subscriptionId}/charge`,
					{
						vendor_id: process.env.NEXT_PUBLIC_PADDLE_VENDOR_ID,
						vendor_auth_code: process.env.PADDLE_AUTH_CODE,
						amount: overagesCost,
						charge_name: `twis.io - ${subscription.plan} plan monthly overages`,
					},
					{
						headers: {
							"Content-Type": "application/json",
						},
					}
				);

				if (!overagesChargeResult.data.success) {
					/**
					 * @todo send error msg to admin and user
					 */
				} else {
					// reset usage
					await Usage.findOneAndUpdate({ _id: subscription.usage._id }, { value: 0, renewDate, updatedAt: Date.now() });
				}
			} else {
				// fair usage - if the overages wasn't that high, we just reset the usage to zero
				await Usage.findOneAndUpdate({ _id: subscription.usage._id }, { value: 0, renewDate, updatedAt: Date.now() });
			}
		}

		return res.status(200).json({ success: true });
	} catch (error) {
		console.log(error);
		return res.status(400).json({ success: false, error });
	}
}
