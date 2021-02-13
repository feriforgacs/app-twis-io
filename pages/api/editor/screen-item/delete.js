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
		methods: ["DELETE"],
	})
);

export default async function ItemDeleteHandler(req, res) {
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

	// delete screen item
	try {
		const result = await ScreenItem.findOneAndDelete({ itemId: itemId });
		if (!result) {
			return res.status(400).json({ success: false });
		}

		/**
		 * Update items order index
		 * Update only those items where the order index is higher than the order index of the deleted item
		 * if deleted item's order index is 3, update items where order index is 4, 5, 6
		 */
		await ScreenItem.updateMany(
			{ screenId: result.screenId, orderIndex: { $gt: result.orderIndex } },
			{
				$inc: { orderIndex: -1 },
			}
		);

		return res.status(200).json({ success: true });
	} catch (error) {
		return res.status(400).json({ success: false });
	}
}
