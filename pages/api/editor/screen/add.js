import mongoose from "mongoose";
import Cors from "cors";
import { getSession } from "next-auth/client";
import initMiddleware from "../../../../lib/InitMiddleware";
import AuthCheck from "../../../../lib/AuthCheck";
import DatabaseConnect from "../../../../lib/DatabaseConnect";
import Campaign from "../../../../models/Campaign";
import Screen from "../../../../models/editor/Screen";
import ScreenItem from "../../../../models/editor/ScreenItem";

const cors = initMiddleware(
	Cors({
		methods: ["POST"],
	})
);

export default async function ScreenAddHandler(req, res) {
	await cors(req, res);

	const authStatus = await AuthCheck(req, res);
	if (!authStatus) {
		return res.end();
	}

	let campaignId;

	if (!req.body.campaignId) {
		return res.status(400).json({ success: false, error: "missing campaign id" });
	}

	// validate campaign id parameter
	if (mongoose.Types.ObjectId.isValid(req.body.campaignId)) {
		campaignId = req.body.campaignId;
	} else {
		return res.status(400).json({ success: false, error: "invalid campaign id" });
	}

	const newScreenData = req.body.screen;

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

	// create new screen in the db
	try {
		// update success screen and failure screen indexes in the db
		const screenIndexUpdateResult = await Screen.updateMany(
			{ campaignId: campaignId, orderIndex: { $gte: req.body.screen.orderIndex } },
			{
				$inc: { orderIndex: +1 },
			}
		);

		if (!screenIndexUpdateResult) {
			return res.status(400).json({ success: false });
		}

		// get screen items from the screen object, and remove it
		const newScreenItems = [...newScreenData.screenItems];
		delete newScreenData.screenItems;

		const newScreen = await Screen.create(newScreenData);

		if (!newScreen) {
			return res.status(400).json({ success: false });
		}

		// save screen items
		newScreenItems.forEach((item, index) => {
			newScreenItems[index].screenId = newScreen._id;
		});

		const newScreenItemsResult = await ScreenItem.insertMany(newScreenItems);

		if (!newScreenItemsResult) {
			return res.status(400).json({ success: false });
		}

		newScreen.screenItems = newScreenItems;

		return res.status(200).json({ success: true, screen: newScreen });
	} catch (error) {
		console.log(error);
		return res.status(400).json({ success: false, error });
	}
}
