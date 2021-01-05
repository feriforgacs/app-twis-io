import Cors from "cors";
import initMiddleware from "../../../lib/InitMiddleware";
import AuthCheck from "../../../lib/AuthCheck";

const cors = initMiddleware(
	Cors({
		methods: ["GET"],
	})
);

export default async function CampaignListHandler(req, res) {
	await cors(req, res);

	const authStatus = await AuthCheck(req, res);
	if (!authStatus) {
		res.end();
		return;
	}

	/**
	 * TODO
	 * Get campaigns from the database
	 */
	res.status(200).json({ campaign: req.query.id });
}
