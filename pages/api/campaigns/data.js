import mongoose from "mongoose";
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

export default async function CampaignDataHandler(req, res) {
	await cors(req, res);

	const authStatus = await AuthCheck(req, res);
	if (!authStatus) {
		res.end();
		return;
	}

	await DatabaseConnect();

	const session = await getSession({ req });

	if (!req.query.id) {
		res.status(400).json({ success: false, error: "missing campaign id" });
		return;
	}

	let campaignId;
	if (req.query.id && req.query.id !== "") {
		// validate campaign id parameter
		if (mongoose.Types.ObjectId.isValid(req.query.id)) {
			campaignId = req.query.id;
		} else {
			res.status(400).json({ success: false, error: "invalid campaign id" });
			return;
		}
	}

	/**
	 * Get campaign data from the database
	 */
	try {
		const campaign = await Campaign.findOne({ _id: campaignId, createdBy: session.user.id });
		res.status(200).json({ success: true, data: campaign });
	} catch (error) {
		res.status(400).json({ success: false });
	}
}
