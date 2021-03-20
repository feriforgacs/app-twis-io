import Cors from "cors";
import { getSession } from "next-auth/client";
import initMiddleware from "../../../lib/InitMiddleware";
import AuthCheck from "../../../lib/AuthCheck";
import DatabaseConnect from "../../../lib/DatabaseConnect";
import Participant from "../../../models/Participant";
import Campaign from "../../../models/Campaign"; // eslint-disable-line
import Answer from "../../../models/Answer";
import mongoose from "mongoose";

const cors = initMiddleware(
	Cors({
		methods: ["POST"],
	})
);

export default async function DataRequestHandler(req, res) {
	await cors(req, res);

	const authStatus = await AuthCheck(req, res);
	if (!authStatus) {
		res.end();
		return;
	}

	await DatabaseConnect();
	const session = await getSession({ req });

	let participantId;
	if (req.query.id && req.query.id !== "") {
		// validate participant id parameter
		if (mongoose.Types.ObjectId.isValid(req.query.id)) {
			participantId = req.query.id;
		} else {
			return res.status(400).json({ success: false, error: "invalid participant id" });
		}
	}

	try {
		const participant = await Participant.findOne({ _id: participantId });
		if (!participant) {
			return res.status(400).json({ success: false, error: "participant doesn't exists" });
		}

		if (!participant.campaign.createdBy.equals(session.user.id)) {
			return res.status(401).json({ success: false, error: "not authorized" });
		}

		const answers = await Answer.findOne({ participantId }).select("answers");
		if (!answers) {
			return res.status(400).json({ success: false, error: "answers doesn't exists" });
		}

		return res.status(200).json({ success: true, participant, answers: answers.answers });
	} catch (error) {
		console.log(error);
		return res.status(400).json({ success: false, error: error });
	}
}
