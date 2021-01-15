import Cors from "cors";
import mongoose from "mongoose";
import { getSession } from "next-auth/client";
import initMiddleware from "../../../lib/InitMiddleware";
import AuthCheck from "../../../lib/AuthCheck";
import DatabaseConnect from "../../../lib/DatabaseConnect";
import EventLog from "../../../lib/EventLog";
import Campaign from "../../../models/Campaign";
import Participant from "../../../models/Participant";

const cors = initMiddleware(
	Cors({
		methods: ["DELETE"],
	})
);

export default async function ParticipantDeleteHandler(req, res) {
	await cors(req, res);

	const authStatus = await AuthCheck(req, res);
	if (!authStatus) {
		res.end();
		return;
	}

	await DatabaseConnect();

	// check campaign id and participant id
	if (!req.body.id || !req.body.campaignId) {
		res.status(400).json({ success: false, error: "missing participant or campaign id" });
		return;
	}

	// check campaign id and participant id format
	const campaignId = req.body.campaignId;
	const participantId = req.body.id;
	if (!mongoose.Types.ObjectId.isValid(campaignId) || !mongoose.Types.ObjectId.isValid(participantId)) {
		res.status(400).json({ success: false, error: "invalid campaign or participant id" });
		return;
	}

	const session = await getSession({ req });

	// check user and campaign connection
	try {
		const campaign = await Campaign.countDocuments({ _id: campaignId, createdBy: session.user.id });
		if (!campaign) {
			res.status(400).json({ success: false, error: "not authorized" });
			return;
		}
	} catch (error) {
		res.status(400).json({ success: false, error });
		return;
	}

	// delete participant from the database
	try {
		await Participant.findOneAndDelete({ _id: participantId, campaignId });
		await EventLog(`participant delete - participant id: ${participantId} - campaign id: ${campaignId}`, session.user.id);
		res.status(200).json({ success: true });
	} catch (error) {
		res.status(400).json({ success: false });
	}
}
