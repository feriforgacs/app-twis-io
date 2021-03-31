import Cors from "cors";
import { getSession } from "next-auth/client";
import initMiddleware from "../../../lib/InitMiddleware";
import AuthCheck from "../../../lib/AuthCheck";
import DatabaseConnect from "../../../lib/DatabaseConnect";
import EventLog from "../../../lib/EventLog";
import Campaign from "../../../models/Campaign";
import Participant from "../../../models/Participant";
import Screen from "../../../models/editor/Screen";
import ScreenItem from "../../../models/editor/ScreenItem";
import Answer from "../../../models/Answer";

const cors = initMiddleware(
	Cors({
		methods: ["DELETE"],
	})
);

export default async function DeleteRequestHandler(req, res) {
	await cors(req, res);

	const authStatus = await AuthCheck(req, res);
	if (!authStatus) {
		return res.end();
	}

	await DatabaseConnect();
	const session = await getSession({ req });

	// check user id
	if (!req.body.id) {
		return res.status(400).json({ success: false, error: "missing user id" });
	}

	if (req.body.id !== session.user.id) {
		return res.status(400).json({ success: false, error: "invalid user id" });
	}

	/**
	 * @todo delete campaigns
	 * @todo delete screens
	 * @todo delete screen items
	 * @todo delete participants
	 * @todo delete answers
	 * @todo cancel subscription
	 * @todo delete user
	 */

	// get user's campaigns
	let campaigns = [];
	try {
		campaigns = await Campaign.find({ createdBy: session.user.id }).distinct("_id");
	} catch (error) {
		console.log(error);
		return res.status(400).json({ success: false, error });
	}

	console.log(campaigns);

	// get campaign screens
	let screens = [];
	if (campaigns.length > 0) {
		try {
			screens = await Screen.find({ campaignId: { $in: campaigns } });
		} catch (error) {
			console.log(error);
			return res.status(400).json({ success: false, error });
		}
	}

	// get screen items
	let screenItemsDelete;
	if (screens.length > 0) {
		try {
			screenItemsDelete = ScreenItem.deleteMany({ screenId: { $in: screens } });
		} catch (error) {
			console.log(error);
			return res.status(400).json({ success: false, error });
		}
	}

	return res.status(400).json({ success: false });
}
