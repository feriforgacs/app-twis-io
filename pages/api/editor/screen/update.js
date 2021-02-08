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

export default async function ScreenUpdateHandler(req, res) {
	await cors(req, res);

	const authStatus = await AuthCheck(req, res);
	if (!authStatus) {
		return res.end();
	}

	let campaignId;
	let screenId;

	if (!req.body.campaignId || !req.body.screenId) {
		return res.status(400).json({ success: false, error: "missing campaign or screen item id" });
	}

	screenId = req.body.screenId; // this is not the mongodb document id, but the generated uuid of the screen item

	// validate campaign id parameter
	if (mongoose.Types.ObjectId.isValid(req.body.campaignId)) {
		campaignId = req.body.campaignId;
	} else {
		return res.status(400).json({ success: false, error: "invalid campaign id" });
	}

	const newScreenData = req.body.screenData;

	if (!newScreenData) {
		return res.status(400).json({ success: false, error: "missing new screen data" });
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

	try {
		const result = await Screen.findOneAndUpdate({ campaignId: campaignId, screenId: screenId }, { ...newScreenData });
		if (!result) {
			return res.status(400).json({ success: false });
		}

		return res.status(200).json({ success: true });
	} catch (error) {
		console.log(error);
		return res.status(400).json({ success: false, error });
	}
}
