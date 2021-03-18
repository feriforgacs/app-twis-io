/**
 * This endpoint is used by the frontend
 */
import mongoose from "mongoose";
import Cors from "cors";
import initMiddleware from "../../../lib/InitMiddleware";
import DatabaseConnect from "../../../lib/DatabaseConnect";
import Campaign from "../../../models/Campaign";
import Screen from "../../../models/editor/Screen";
import ScreenItem from "../../../models/editor/ScreenItem"; // eslint-disable-line

const cors = initMiddleware(
	Cors({
		methods: ["GET"],
	})
);

export default async function CampaignDataHandler(req, res) {
	await cors(req, res);

	await DatabaseConnect();

	if (!req.query.id) {
		return res.status(400).json({ success: false, error: "missing campaign id" });
	}

	let campaignId;
	if (req.query.id && req.query.id !== "") {
		// validate campaign id parameter
		if (mongoose.Types.ObjectId.isValid(req.query.id)) {
			campaignId = req.query.id;
		} else {
			return res.status(400).json({ success: false, error: "invalid campaign id" });
		}
	}

	/**
	 * Get campaign data from the database
	 */
	try {
		const campaign = await Campaign.findOne({ _id: campaignId }).select(["-participantCount", "-createdBy", "-createdAt", "-updatedAt", "-__v"]);

		if (!campaign) {
			return res.status(400).json({ success: false });
		}

		const screens = await Screen.find({ campaignId: campaignId }).select(["-createdAt", "-updatedAt", "-__v"]).sort({ orderIndex: 1 });

		if (!screens) {
			return res.status(400).json({ success: false });
		}

		return res.status(200).json({ success: true, campaign: campaign, screens: screens });
	} catch (error) {
		console.log(error);
		return res.status(400).json({ success: false });
	}
}
