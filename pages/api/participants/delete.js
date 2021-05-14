import Cors from "cors";
import mongoose from "mongoose";
import { getSession } from "next-auth/client";
import initMiddleware from "../../../lib/InitMiddleware";
import AuthCheck from "../../../lib/AuthCheck";
import DatabaseConnect from "../../../lib/DatabaseConnect";
import EventLog from "../../../lib/EventLog";
import Campaign from "../../../models/Campaign";
import Participant from "../../../models/Participant";
import Answer from "../../../models/Answer";

const cors = initMiddleware(
	Cors({
		methods: ["DELETE"],
	})
);

export default async function ParticipantDeleteHandler(req, res) {
	await cors(req, res);

	const authStatus = await AuthCheck(req, res);
	if (!authStatus) {
		return res.end();
	}

	await DatabaseConnect();

	// check campaign id and participant id
	if (!req.body.id || !req.body.campaignId) {
		return res.status(400).json({ success: false, error: "missing participant or campaign id" });
	}

	// check campaign id and participant id format
	const campaignId = req.body.campaignId;
	const participantId = req.body.id;
	if (!mongoose.Types.ObjectId.isValid(campaignId) || !mongoose.Types.ObjectId.isValid(participantId)) {
		return res.status(400).json({ success: false, error: "invalid campaign or participant id" });
	}

	const session = await getSession({ req });

	// check user and campaign connection
	try {
		const campaign = await Campaign.countDocuments({ _id: campaignId, createdBy: session.user.id });
		if (!campaign) {
			return res.status(401).json({ success: false, error: "not authorized" });
		}
	} catch (error) {
		return res.status(400).json({ success: false, error });
	}

	// delete participant from the database
	try {
		const participant = await Participant.findOneAndDelete({ _id: participantId, campaignId });

		if (!participant) {
			return res.status(400).json({ success: false, error: "can't remove participant from the db" });
		}

		// log event
		const eventLogPromise = EventLog(`participant delete - participant id: ${participantId} - campaign id: ${campaignId}`, session.user.id, session.user.email);

		// delete participant answers
		const answersDeletePromise = Answer.deleteMany({ participantId: participantId });

		// update campaign participant count
		const campaignUpdatePromise = Campaign.findOneAndUpdate(
			{ _id: campaignId },
			{
				$inc: {
					participantCount: -1,
					answerCount: -1,
				},
			}
		);

		await Promise.all([eventLogPromise, answersDeletePromise, campaignUpdatePromise]);

		return res.status(200).json({ success: true });
	} catch (error) {
		return res.status(400).json({ success: false, error: error });
	}
}
