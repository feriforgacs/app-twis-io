import Cors from "cors";
import { v4 as uuidv4 } from "uuid";
import { getSession } from "next-auth/client";
import initMiddleware from "../../../lib/InitMiddleware";
import AuthCheck from "../../../lib/AuthCheck";
import DatabaseConnect from "../../../lib/DatabaseConnect";
import Campaign from "../../../models/Campaign";
import Screen from "../../../models/editor/Screen";
import ScreenItem from "../../../models/editor/ScreenItem";

const cors = initMiddleware(
	Cors({
		methods: ["POST"],
	})
);

export default async function CampaignDuplicateHandler(req, res) {
	await cors(req, res);

	const authStatus = await AuthCheck(req, res);
	if (!authStatus) {
		res.end();
		return;
	}

	await DatabaseConnect();

	// check campaign id
	if (!req.body.id) {
		res.status(400).json({ success: false, error: "missing campaign id" });
		return;
	}

	// check campaign id format
	const campaignId = req.body.id;
	if (!mongoose.Types.ObjectId.isValid(campaignId)) {
		res.status(400).json({ success: false, error: "invalid campaign id" });
		return;
	}

	// check user and campaign connection
	let campaign;
	try {
		campaign = await Campaign.findOne({ _id: campaignId, createdBy: session.user.id });
		if (!campaign) {
			res.status(400).json({ success: false, error: "not authorized" });
			return;
		}
	} catch (error) {
		res.status(400).json({ success: false, error });
		return;
	}

	console.log(campaign);
	try {
		/**
		 * @todo get campaign screens if necessary
		 * @todo get campaign screen items
		 * @todo create new campaign
		 * @todo generate new uuid-s
		 * @todo create new items
		 * @todo send back new campaign data
		 */
		return res.status(400).json({ success: false });
	} catch (error) {
		return res.status(400).json({ success: false });
	}
}
