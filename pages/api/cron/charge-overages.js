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
	/**
	 * @todo get usage from the db where overages exists and subscription renews today
	 * @todo calculate overages costs
	 * @todo send charge request to paddle
	 * @todo reset overages on success
	 */
	await cors(req, res);
	await DatabaseConnect();

	// get extra usage from the database
	try {
		const overages = await Usage.find({ $expr: { $gt: ["value", "limit"] } }).and({ renewDate: { $lte: new Date(Date.now()) } });

		if (overages.length <= 0) {
			return res.status(200).send("no overages to charge today");
		}

		// get subscription for users
		return res.status(200).json({ overages });
	} catch (error) {
		console.log(error);
		return res.status(400).json({ success: false, error });
	}
}
