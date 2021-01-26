import mongoose from "mongoose";
import Cors from "cors";
import { getSession } from "next-auth/client";
import initMiddleware from "../../../../lib/InitMiddleware";
import AuthCheck from "../../../../lib/AuthCheck";
import DatabaseConnect from "../../../../lib/DatabaseConnect";
import Campaign from "../../../../models/Campaign";
import Screen from "../../../../models/editor/Screen";

const cors = initMiddleware(
	Cors({
		methods: ["POST"],
	})
);

export default async function UpdateHandler(req, res) {
	await cors(req, res);

	const authStatus = await AuthCheck(req, res);
	if (!authStatus) {
		return res.end();
	}

	let campaignId;
	if (req.body.campaignId && req.body.campaignId !== "") {
		// validate campaign id parameter
		if (mongoose.Types.ObjectId.isValid(req.body.campaignId)) {
			campaignId = req.body.campaignId;
		} else {
			return res.status(400).json({ success: false, error: "invalid campaign id" });
		}
	} else {
		return res.status(400).json({ success: false, error: "invalid campaign id" });
	}

	await DatabaseConnect();

	const session = await getSession({ req });

	// check user and campaign connection
	try {
		const campaign = await Campaign.countDocuments({ _id: campaignId, createdBy: session.user.id });
		if (!campaign) {
			return res.status(400).json({ success: false, error: "not authorized" });
		}
	} catch (error) {
		return res.status(400).json({ success: false, error });
	}

	// create new screen in the db
	try {
		const newScreen = await Screen.create(req.body.screen);

		if (!newScreen) {
			return res.status(400).json({ success: false });
		}

		return res.status(200).json({ success: true, screen: newScreen });
	} catch (error) {
		return res.status(400).json({ success: false, error });
	}
}
