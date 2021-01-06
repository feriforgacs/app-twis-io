import escapeStringRegexp from "escape-string-regexp";
import Cors from "cors";
import { getSession } from "next-auth/client";
import initMiddleware from "../../../lib/InitMiddleware";
import AuthCheck from "../../../lib/AuthCheck";
import DatabaseConnect from "../../../lib/DatabaseConnect";
import Campaign from "../../../models/Campaign";

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

	await DatabaseConnect();
	const session = await getSession({ req });

	// check limit in the params
	let limit = 10;
	if (req.query.limit) {
		limit = parseInt(req.query.limit) || 10;
	}

	// check search query in the params
	let search = "";
	if (req.query.search) {
		search = escapeStringRegexp(req.query.search);
	}

	// get campaigns from the database
	try {
		const campaigns = await Campaign.find({ name: { $regex: search }, createdBy: session.user.id }).limit(limit);
		res.status(200).json({ success: true, data: campaigns });
	} catch (error) {
		res.status(400).json({ success: false });
	}
}
