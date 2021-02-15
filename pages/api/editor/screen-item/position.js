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

export default async function ItemPositionUpdateHandler(req, res) {
	await cors(req, res);

	const authStatus = await AuthCheck(req, res);
	if (!authStatus) {
		return res.end();
	}

	let campaignId;
	let itemId;

	if (!req.body.campaignId || !req.body.itemId) {
		return res.status(400).json({ success: false, error: "missing campaign or screen item id" });
	}

	itemId = req.body.itemId; // this is not the mongodb document id, but the generated uuid of the screen item

	// validate campaign id parameter
	if (mongoose.Types.ObjectId.isValid(req.body.campaignId)) {
		campaignId = req.body.campaignId;
	} else {
		return res.status(400).json({ success: false, error: "invalid campaign id" });
	}

	if (!req.body.direction) {
		return res.status(400).json({ success: false, error: "missing direction data" });
	}

	let direction = req.body.direction;

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

	// get item data from db
	let currentItem;
	try {
		currentItem = await ScreenItem.findOne({ itemId: itemId });

		if (!currentItem) {
			return res.status(400).json({ success: false, error: "can't find item in the db" });
		}
	} catch (error) {
		return res.status(400).json({ success: false, error });
	}

	// get screen items from the db
	let screenItemsCount;
	try {
		screenItemsCount = await ScreenItem.countDocuments({ screenId: currentItem.screenId });
		if (!screenItemsCount) {
			return res.status(400).json({ success: false, error: "can't get screen items from the db" });
		}
	} catch (error) {
		return res.status(400).json({ success: false, error });
	}

	let newOrderIndex;
	switch (direction) {
		case "forward":
			/**
			 * Move item forward
			 */
			newOrderIndex = currentItem.orderIndex + 1;

			if (newOrderIndex >= screenItemsCount) {
				// item is already in front, no changes
				res.status(200).json({ success: true });
			}

			// decrease the order index of the next item in the items array
			try {
				const nextItemPromise = ScreenItem.findOneAndUpdate(
					{ screenId: currentItem.screenId, orderIndex: newOrderIndex },
					{
						$inc: {
							orderIndex: -1,
						},
					}
				);

				const currentItemPromise = ScreenItem.findOneAndUpdate({ _id: currentItem._id }, { orderIndex: newOrderIndex });

				const [nextItemResult, currentItemResult] = await Promise.all([nextItemPromise, currentItemPromise]);

				if (!nextItemResult || !currentItemResult) {
					return res.status(400).json({ success: false });
				}
			} catch (error) {
				return res.status(400).json({ success: false, error });
			}

			return res.status(200).json({ success: true });

		case "front":
			/**
			 * @todo
			 */
			break;

		case "backward":
			/**
			 * @todo
			 */
			break;

		case "back":
			/**
			 * @todo
			 */
			break;

		default:
			break;
	}

	return res.status(400).json({ success: false });
}
