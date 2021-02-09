import mongoose from "mongoose";
import Cors from "cors";
import { getSession } from "next-auth/client";
import initMiddleware from "../../../../lib/InitMiddleware";
import AuthCheck from "../../../../lib/AuthCheck";
import DatabaseConnect from "../../../../lib/DatabaseConnect";
import Campaign from "../../../../models/Campaign";
import ScreenItem from "../../../../models/editor/ScreenItem";

const cors = initMiddleware(
	Cors({
		methods: ["POST"],
	})
);

export default async function ItemUpdateHandler(req, res) {
	await cors(req, res);

	const authStatus = await AuthCheck(req, res);
	if (!authStatus) {
		return res.end();
	}

	let campaignId;
	let screenItemId;

	if (!req.body.campaignId || !req.body.screenItemId) {
		return res.status(400).json({ success: false, error: "missing campaign or screen item id" });
	}

	screenItemId = req.body.screenItemId; // this is not the mongodb document id, but the generated uuid of the screen item

	// validate campaign id parameter
	if (mongoose.Types.ObjectId.isValid(req.body.campaignId)) {
		campaignId = req.body.campaignId;
	} else {
		return res.status(400).json({ success: false, error: "invalid campaign id" });
	}

	if (!req.body.screenItemUpdatedData) {
		return res.status(400).json({ success: false, error: "missing update data" });
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

	// update screen item data
	try {
		const result = await ScreenItem.findOneAndUpdate({ itemId: screenItemId }, { ...req.body.screenItemUpdatedData });
		if (!result) {
			return res.status(400).json({ success: false });
		}

		return res.status(200).json({ success: true });
	} catch (error) {
		return res.status(400).json({ success: false });
	}
}
