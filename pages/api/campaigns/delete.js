import Cors from "cors";
import mongoose from "mongoose";
import { getSession } from "next-auth/client";
import initMiddleware from "../../../lib/InitMiddleware";
import AuthCheck from "../../../lib/AuthCheck";
import DatabaseConnect from "../../../lib/DatabaseConnect";
import EventLog from "../../../lib/EventLog";
import Campaign from "../../../models/Campaign";
import Participant from "../../../models/Participant";
import Screen from "../../../models/editor/Screen";
import ScreenItem from "../../../models/editor/ScreenItem";

const cors = initMiddleware(
	Cors({
		methods: ["DELETE"],
	})
);

export default async function CampaignDeleteHandler(req, res) {
	await cors(req, res);

	const authStatus = await AuthCheck(req, res);
	if (!authStatus) {
		return res.end();
	}

	await DatabaseConnect();
	const session = await getSession({ req });

	// check campaign id
	if (!req.body.id) {
		return res.status(400).json({ success: false, error: "missing campaign id" });
	}

	// check campaign id format
	const campaignId = req.body.id;
	if (!mongoose.Types.ObjectId.isValid(campaignId)) {
		return res.status(400).json({ success: false, error: "invalid campaign id" });
	}

	// check user and campaign connection
	try {
		const campaign = await Campaign.countDocuments({ _id: campaignId, createdBy: session.user.id });
		if (!campaign) {
			return res.status(401).json({ success: false, error: "not authorized" });
		}
	} catch (error) {
		console.log(error);
		return res.status(400).json({ success: false, error });
	}

	// remove campaign participants from the database
	try {
		await Participant.deleteMany({ campaignId: campaignId });
	} catch (error) {
		console.log(error);
		return res.status(400).json({ success: false, error });
	}

	/**
	 * @todo - remove participants' answers from the database
	 */

	// remove screens and screen items from the database
	try {
		// get campaign screens from the db
		const screens = await Screen.find({ campaignId: campaignId });
		if (screens) {
			// get screen ids, so late we can use it to delete screen items
			const screenIds = screens.map((screen) => screen._id);

			if (screenIds.length > 0) {
				// delete screen items
				const screenItemDeletePromise = ScreenItem.deleteMany({ screenId: { $in: screenIds } });
				// delete screens
				const screenDeletePromise = Screen.deleteMany({ campaignId: campaignId });
				await Promise.all([screenItemDeletePromise, screenDeletePromise]);
			}
		}
	} catch (error) {
		console.log(error);
		return res.status(400).json({ success: false, error });
	}

	// remove campaign from the database
	try {
		await Campaign.findOneAndDelete({ _id: campaignId, createdBy: session.user.id });
		await EventLog(`campaign delete - campaign id: ${campaignId}`, session.user.id);
		return res.status(200).json({ success: true });
	} catch (error) {
		console.log(error);
		return res.status(400).json({ success: false, error: error });
	}
}
