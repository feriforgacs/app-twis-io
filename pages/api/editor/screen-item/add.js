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

export default async function AddScreenHandler(req, res) {
	await cors(req, res);

	const authStatus = await AuthCheck(req, res);
	if (!authStatus) {
		return res.end();
	}

	let campaignId;
	let screenId;

	if (!req.body.campaignId || !req.body.screenId) {
		return res.status(400).json({ success: false, error: "missing campaign or screen id" });
	}

	// validate campaign id parameter
	if (mongoose.Types.ObjectId.isValid(req.body.campaignId)) {
		campaignId = req.body.campaignId;
	} else {
		return res.status(400).json({ success: false, error: "invalid campaign id" });
	}

	// validate screen id parameter
	if (mongoose.Types.ObjectId.isValid(req.body.screenId)) {
		screenId = req.body.screenId;
	} else {
		return res.status(400).json({ success: false, error: "invalid screen id" });
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

	// create new screen item in the db
	try {
		const newScreenItemData = { ...req.body.screenItem, screenId };
		const newScreenItem = await ScreenItem.create(newScreenItemData);

		if (!newScreenItem) {
			return res.status(400).json({ success: false });
		}

		return res.status(200).json({ success: true, screenItem: newScreenItem });
	} catch (error) {
		console.log(error);
		return res.status(400).json({ success: false, error });
	}
}
