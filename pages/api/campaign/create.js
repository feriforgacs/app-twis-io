import Cors from "cors";
import initMiddleware from "../../../lib/init-middleware";
import AuthCheck from "../../../lib/AuthCheck";

const cors = initMiddleware(
	Cors({
		methods: ["POST"],
	})
);

export default async function CampaignCreateHandler(req, res) {
	await cors(req, res);

	const authStatus = await AuthCheck(req, res);
	if (!authStatus) {
		res.end();
		return;
	}

	/**
	 * TODO
	 * Check required campaign data
	 */

	/**
	 * TODO
	 * Save campaign data to the database
	 */

	/**
	 * Return created campaign ID and data
	 */
	res.status(200).json({ campaign: "New Campaign ID and data..." });
}
