import Cors from "cors";
import { addMonths } from "date-fns";
import initMiddleware from "../../../../lib/InitMiddleware";
import DatabaseConnect from "../../../../lib/DatabaseConnect";
import Usage from "../../../../models/Usage";
import Subscription from "../../../../models/Subscription";

const cors = initMiddleware(
	Cors({
		methods: ["GET"],
	})
);

export default async function ResetUsageHandler(req, res) {
	await cors(req, res);
	await DatabaseConnect();

	/**
	 * Get subscribers with yearly plans
	 */
	try {
		const yearlySubscriptions = await Subscription.find({ planTerm: "yearly", status: "active" });
		let usageIDs = [];

		// no active yearly subscriptions
		if (yearlySubscriptions.length <= 0) {
			return res.status(200).json({ success: true, message: "no active yearly subscriptions" });
		}

		// get usage IDs from active yearly subscriptions
		yearlySubscriptions.forEach((yearlySubscription) => {
			const usageRenewDate = new Date(yearlySubscription.usage.renewDate);
			const endOfToday = new Date(Date.now()).setHours(23, 59, 59, 59);
			if (usageRenewDate <= endOfToday && !yearlySubscription.usage.limitReached) {
				usageIDs.push(yearlySubscription.usage._id);
			}
		});

		// no usage that should be reseted today
		if (usageIDs.length <= 0) {
			return res.status(200).json({ success: true, message: "no yearly subscriptions with usage that should be reseted today" });
		}

		// update usages
		const renewDate = addMonths(new Date(Date.now()), 1);
		const updatedUsages = await Usage.updateMany(
			{ _id: { $in: usageIDs } },
			{
				value: 0,
				renewDate,
			}
		);

		if (!updatedUsages) {
			return res.status(400).json({ success: false, error: "yearly subscription usage update error" });
		}

		return res.status(200).json({ success: true, usageIDs });
	} catch (error) {
		console.log(error);
		return res.status(400).json({ success: false, error });
	}
}
