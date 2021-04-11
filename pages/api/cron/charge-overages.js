import Cors from "cors";
import initMiddleware from "../../../lib/InitMiddleware";
import DatabaseConnect from "../../../lib/DatabaseConnect";

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
	try {
	} catch (error) {
		console.log(error);
		return res.status(400).json({ success: false, error });
	}
}
