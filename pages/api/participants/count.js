import Cors from "cors";
import { getSession } from "next-auth/client";
import initMiddleware from "../../../lib/InitMiddleware";
import AuthCheck from "../../../lib/AuthCheck";
import DatabaseConnect from "../../../lib/DatabaseConnect";
import Participant from "../../../models/Participant";
import Campaign from "../../../models/Campaign";
import mongoose from "mongoose";

const cors = initMiddleware(
	Cors({
		methods: ["GET"],
	})
);

export default async function ParticipantCountHandler(req, res) {
	await cors(req, res);

	const authStatus = await AuthCheck(req, res);
	if (!authStatus) {
		res.end();
		return;
	}

	await DatabaseConnect();
	const session = await getSession({ req });

	let campaignId;
	/**
	 * Validate campaign id parameter
	 */
	if (req.query.id && req.query.id !== "" && mongoose.Types.ObjectId.isValid(req.query.id)) {
		campaignId = req.query.id;
	} else {
		res.status(400).json({ success: false });
		return;
	}

	/**
	 * Check campaign and user connection
	 */
	try {
		const campaign = await Campaign.countDocuments({ _id: campaignId, createdBy: session.user.id });
		if (!campaign) {
			res.status(400).json({ success: false });
			return;
		}
	} catch (error) {
		res.status(400).json({ success: false });
		return;
	}

	try {
		const participants = await Participant.countDocuments({ campaignId: campaignId });
		res.status(200).json({ success: true, data: participants });
	} catch (error) {
		res.status(400).json({ success: false });
	}
	return;
}
