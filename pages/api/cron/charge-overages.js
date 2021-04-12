import Cors from "cors";
import initMiddleware from "../../../lib/InitMiddleware";
import DatabaseConnect from "../../../lib/DatabaseConnect";
import Usage from "../../../models/Usage";
import Subscription from "../../../models/Subscription";

const cors = initMiddleware(
	Cors({
		methods: ["POST"],
	})
);

export default async function ChargeOveragesHandler(req, res) {
	await cors(req, res);
	await DatabaseConnect();

	// get extra usage from the database
	try {
		let overages = await Usage.find({ $expr: { $gt: ["value", "limit"] } })
			.and({ renewDate: { $lte: new Date(Date.now()) } })
			.and({ trialAccount: false });

		if (overages.length <= 0) {
			return res.status(200).send("no overages to charge today");
		}

		let overagesUsers = [];
		for (let overage of overages) {
			overagesUsers.push(overage.userId);
		}

		console.log(overagesUsers);

		/**
		 * @todo get subscriptions
		 * @todo calculate overages costs
		 * @todo send charge request to paddle https://developer.paddle.com/api-reference/subscription-api/one-off-charges/createcharge
		 * @todo reset overages on success
		 */

		return res.status(200).json({ overages });
	} catch (error) {
		console.log(error);
		return res.status(400).json({ success: false, error });
	}
}
