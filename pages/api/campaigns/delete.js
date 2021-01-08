import Cors from "cors";
import { getSession } from "next-auth/client";
import initMiddleware from "../../../lib/InitMiddleware";
import AuthCheck from "../../../lib/AuthCheck";
import DatabaseConnect from "../../../lib/DatabaseConnect";
import Campaign from "../../../models/Campaign";
import Participant from "../../../models/Participant";

const cors = initMiddleware(
	Cors({
		methods: ["DELETE"],
	})
);

export default async function CampaignDeleteHandler(req, res) {
	await cors(req, res);

	const authStatus = await AuthCheck(req, res);
	if (!authStatus) {
		res.end();
		return;
	}

	await DatabaseConnect();
	const session = await getSession({ req });

	// TODO - remove participant's answers from the database

	// remove campaign participants from the database
	try {
		await Participant.deleteMany({ campaignId: req.body.id });
	} catch (error) {
		res.status(400).json({ success: false, error });
		return;
	}

	// remove campaign from the database
	try {
		await Campaign.findOneAndDelete({ _id: req.body.id, createdBy: session.user.id });

		res.status(200).json({ success: true });
	} catch (error) {
		res.status(400).json({ success: false });
	}
}
