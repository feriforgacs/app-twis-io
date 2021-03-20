import Cors from "cors";
import { getSession } from "next-auth/client";
import initMiddleware from "../../../lib/InitMiddleware";
import AuthCheck from "../../../lib/AuthCheck";
import DatabaseConnect from "../../../lib/DatabaseConnect";
import Participant from "../../../models/Participant";
import Campaign from "../../../models/Campaign"; // eslint-disable-line
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

		if (participant.campaign.createdBy !== session.user.id) {
			return res.status(401).json({ success: false, error: "not authorized" });
		}

		console.log(participant);
	} catch (error) {
		console.log(error);
		return res.status(400).json({ success: false, error: error });
	}
}
