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

export default async function ScreenDuplicateHandler(req, res) {
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

	// get screen items so we can save them to the db later
	let screenItems = newScreenData.screenItems;
	// remove screen items from the screen data as they'll be added separately later
	delete newScreenData.screenItems;
	delete newScreenData.createdAt;
	delete newScreenData.updatedAt;

	// create new screen in the database
	let duplicatedScreen;
	try {
		duplicatedScreen = await Screen.create(newScreenData);

		if (!duplicatedScreen) {
			return res.status(400).json({ success: false });
		}
	} catch (error) {
		console.log(error);
		return res.status(400).json({ success: false, error });
	}

	// update order index of existing screens
	try {
		const screenIndexUpdateResult = await Screen.updateMany(
			{ campaignId: campaignId, screenId: { $ne: newScreenData.screenId }, orderIndex: { $gte: newScreenData.orderIndex } },
			{
				$inc: { orderIndex: +1 },
			}
		);

		if (!screenIndexUpdateResult) {
			return res.status(400).json({ success: false });
		}
	} catch (error) {
		console.log(error);
		return res.status(400).json({ success: false, error });
	}

	// add screen items
	try {
		// update screen id of screen items
		screenItems = screenItems.map((screenItem) => {
			const updatedScreenItem = { ...screenItem, screenId: duplicatedScreen._id };
			delete updatedScreenItem.createdAt;
			delete updatedScreenItem.updatedAt;
			return updatedScreenItem;
		});

		const newScreenItems = await ScreenItem.insertMany(screenItems);

		return res.status(200).json({ success: true, screen: duplicatedScreen, screenItems: newScreenItems });
	} catch (error) {
		console.log(error);
		return res.status(400).json({ success: false, error });
	}
}
