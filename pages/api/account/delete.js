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
import User from "../../../models/User";
import Account from "../../../models/Account";
import Session from "../../../models/Session";
import Usage from "../../../models/Usage";

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

	// get user's campaigns
	let campaigns = [];
	try {
		campaigns = await Campaign.find({ createdBy: session.user.id }).distinct("_id");
	} catch (error) {
		console.log(error);
		return res.status(400).json({ success: false, error });
	}

	// get campaign screens
	let screens = [];
	if (campaigns.length > 0) {
		try {
			screens = await Screen.find({ campaignId: { $in: campaigns } }).distinct("_id");
		} catch (error) {
			console.log(error);
			return res.status(400).json({ success: false, error });
		}
	}

	// delete screen items
	let screenItemsDeletePromise;
	try {
		screenItemsDeletePromise = ScreenItem.deleteMany({ screenId: { $in: screens } });
	} catch (error) {
		console.log(error);
		return res.status(400).json({ success: false, error });
	}

	// delete participants
	let participantsDeletePromise;
	try {
		participantsDeletePromise = Participant.deleteMany({ campaignId: { $in: campaigns } });
	} catch (error) {
		console.log(error);
		return res.status(400).json({ success: false, error });
	}

	// delete answers
	let answersDeletePromise;
	try {
		answersDeletePromise = Answer.deleteMany({ campaignId: { $in: campaigns } });
	} catch (error) {
		console.log(error);
		return res.status(400).json({ success: false, error });
	}

	// delete screens
	let screensDeletePromise;
	try {
		screensDeletePromise = Screen.deleteMany({ campaignId: { $in: campaigns } });
	} catch (error) {
		console.log(error);
		return res.status(400).json({ success: false, error });
	}

	// delete campaigns
	let campaignsDeletePromise;
	try {
		campaignsDeletePromise = Campaign.deleteMany({ createdBy: session.user.id });
	} catch (error) {
		console.log(error);
		return res.status(400).json({ success: false, error });
	}

	// delete user
	let userDeletePromise;
	try {
		userDeletePromise = User.findOneAndDelete({ _id: session.user.id });
	} catch (error) {
		console.log(error);
		return res.status(400).json({ success: false, error });
	}

	// delete account
	let accountDeletePromise;
	try {
		accountDeletePromise = Account.findOneAndDelete({ userId: session.user.id });
	} catch (error) {
		console.log(error);
		return res.status(400).json({ success: false, error });
	}

	// delete session
	let sessionDeletePromise;
	try {
		sessionDeletePromise = Session.findOneAndDelete({ userId: session.user.id });
	} catch (error) {
		console.log(error);
		return res.status(400).json({ success: false, error });
	}

	// delete usage
	let usageDeletePromise;
	try {
		usageDeletePromise = Usage.findOneAndDelete({ userId: session.user.id });
	} catch (error) {
		console.log(error);
		return res.status(400).json({ success: false, error });
	}

	await Promise.all([screenItemsDeletePromise, participantsDeletePromise, answersDeletePromise, screensDeletePromise, campaignsDeletePromise, userDeletePromise, accountDeletePromise, sessionDeletePromise, usageDeletePromise]);

	// log event
	await EventLog(`account delete`, session.user.id, session.user.email);

	/**
	 * @todo cancel subscription
	 */

	return res.status(200).json({ success: true });
}
