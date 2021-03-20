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
		methods: ["DELETE"],
	})
);

export default async function ScreenDeleteHandler(req, res) {
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

	await DatabaseConnect();

	const session = await getSession({ req });

	// check user and campaign connection
	try {
		const campaign = await Campaign.countDocuments({ _id: campaignId, createdBy: session.user.id });
		if (!campaign) {
			return res.status(401).json({ success: false, error: "not authorized" });
		}
	} catch (error) {
		return res.status(400).json({ success: false, error });
	}

	// delete screen
	try {
		// remove screen
		const result = await Screen.findOneAndDelete({ screenId: screenId });
		if (!result) {
			return res.status(400).json({ success: false });
		}

		/**
		 * Update screens order index
		 * Update only those screens where the order index is higher than the order index of the deleted screen
		 * if deleted screen's order index is 3, update items where order index is 4, 5, 6
		 */
		await Screen.updateMany(
			{ campaignId: campaignId, orderIndex: { $gte: result.orderIndex } },
			{
				$inc: { orderIndex: -1 },
			}
		);

		// remove screen items
		await ScreenItem.deleteMany({ screenId: result._id });

		return res.status(200).json({ success: true });
	} catch (error) {
		console.log(error);
		return res.status(400).json({ success: false });
	}
}
