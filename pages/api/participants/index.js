import escapeStringRegexp from "escape-string-regexp";
import Cors from "cors";
import { getSession } from "next-auth/client";
import initMiddleware from "../../../lib/InitMiddleware";
import AuthCheck from "../../../lib/AuthCheck";
import DatabaseConnect from "../../../lib/DatabaseConnect";
import Campaign from "../../../models/Campaign";
import Participant from "../../../models/Participant";

const cors = initMiddleware(
	Cors({
		methods: ["GET"],
	})
);

export default async function ParticipantListHandler(req, res) {
	await cors(req, res);

	const authStatus = await AuthCheck(req, res);
	if (!authStatus) {
		res.end();
		return;
	}

	await DatabaseConnect();
	const session = await getSession({ req });

	// get the ids of campaigns created by the user
	let campaigns;
	try {
		campaigns = await Campaign.find({ createdBy: session.user.id }).distinct("_id");
	} catch (error) {
		res.status(400).json({ success: false });
	}

	// filter by campaign id
	if (req.query.campaign && req.query.campaign !== "") {
		campaigns = [req.query.campaign];
	}

	// check limit in the params
	let limit = 10;
	if (req.query.limit) {
		limit = parseInt(req.query.limit) || 10;
	}

	// check search query in the params
	let search = "";
	if (req.query.search && req.query.search !== "") {
		search = escapeStringRegexp(req.query.search);
	}

	// get the participants connected to those campaigns
	let participants;
	try {
		if (search !== "") {
			participants = await Participant.find({
				$or: [
					{
						name: { $regex: search, $options: "i" },
					},
					{
						email: { $regex: search, $options: "i" },
					},
				],
			})
				.and({ campaignId: { $in: campaigns } })
				.limit(limit)
				.sort({ createdAt: -1 });
		} else {
			participants = await Participant.find({ campaignId: { $in: campaigns } })
				.limit(limit)
				.sort({ createdAt: -1 });
		}
		res.status(200).json({ success: true, data: participants });
	} catch (error) {
		res.status(400).json({ success: false });
	}
	return;
}
