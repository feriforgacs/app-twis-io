import Cors from "cors";
import initMiddleware from "../../../lib/InitMiddleware";
import AuthCheck from "../../../lib/AuthCheck";
import DatabaseConnect from "../../../lib/DatabaseConnect";
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

	// get campaigns from the database
	try {
		await Participant.findOneAndDelete({ _id: req.body.id, campaignId: req.body.campaignId });

		res.status(200).json({ success: true });
	} catch (error) {
		res.status(400).json({ success: false });
	}
}
