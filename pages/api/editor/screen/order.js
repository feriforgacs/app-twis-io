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

export default async function ScreenOrderHandler(req, res) {
	await cors(req, res);

	const authStatus = await AuthCheck(req, res);
	if (!authStatus) {
		return res.end();
	}

	let campaignId;
	let screenId;
	let direction;

	if (!req.body.campaignId || !req.body.screenId || !req.body.direction) {
		return res.status(400).json({ success: false, error: "missing campaign, screen item id, or direction" });
	}

	screenId = req.body.screenId; // this is not the mongodb document id, but the generated uuid of the screen item

	switch (req.body.direction) {
		case "up":
			direction = -1;
			break;

		case "down":
			direction = 1;
			break;

		default:
			break;
	}

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

	try {
		// update current screen's order index
		const currentScreen = await Screen.findOneAndUpdate(
			{ campaignId: campaignId, screenId: screenId },
			{
				$inc: {
					orderIndex: direction,
				},
			}
		);

		if (!currentScreen) {
			return res.status(400).json({ success: false });
		}

		let siblingScreen;
		if (direction > 0) {
			// moving forward, decrease next screen's order index
			siblingScreen = await Screen.findOneAndUpdate(
				{ campaignId: campaignId, orderIndex: currentScreen.orderIndex + 1, _id: { $ne: currentScreen._id } },
				{
					$inc: {
						orderIndex: -1,
					},
				}
			);
		} else {
			// mowing backward, incriease previous screen's order index
			siblingScreen = await Screen.findOneAndUpdate(
				{ campaignId: campaignId, orderIndex: currentScreen.orderIndex - 1, _id: { $ne: currentScreen._id } },
				{
					$inc: {
						orderIndex: 1,
					},
				}
			);
		}

		if (!siblingScreen) {
			return res.status(400).json({ success: false });
		}
	} catch (error) {
		return res.status(400).json({ success: false, error });
	}

	return res.status(200).json({ success: true });
}
