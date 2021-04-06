import mongoose from "mongoose";
import escapeStringRegexp from "escape-string-regexp";
import Cors from "cors";
import { getSession } from "next-auth/client";
import initMiddleware from "../../../lib/InitMiddleware";
import AuthCheck from "../../../lib/AuthCheck";
import DatabaseConnect from "../../../lib/DatabaseConnect";
import Campaign from "../../../models/Campaign";
import Participant from "../../../models/Participant";
import Usage from "../../../models/Usage";

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

	let campaigns;
	// filter by campaign id
	if (req.query.campaign && req.query.campaign !== "") {
		// check campaign id format
		if (!mongoose.Types.ObjectId.isValid(req.query.campaign)) {
			return res.status(400).json({ success: false, error: "invalid campaign id" });
		}

		try {
			campaigns = await Campaign.find({ createdBy: session.user.id, _id: req.query.campaign }).distinct("_id");
			if (!campaigns.length) {
				return res.status(401).json({ success: false, error: "not authorized" });
			}
		} catch (error) {
			console.log(error);
			return res.status(400).json({ success: false });
		}
	} else {
		// get all campaign ids for campaigns that were created by the user
		try {
			campaigns = await Campaign.find({ createdBy: session.user.id }).distinct("_id");
		} catch (error) {
			console.log(error);
			return res.status(400).json({ success: false });
		}
	}

	// check page in the params
	let page = 0;
	if (req.query.page) {
		page = parseInt(req.query.page) - 1 || 0;
	}

	// check limit in the params
	let limit = 200;
	if (req.query.limit) {
		limit = parseInt(req.query.limit) || 200;
	}

	// check search query in the params
	let search = "";
	if (req.query.search && req.query.search !== "") {
		search = escapeStringRegexp(req.query.search);
	}

	// get usage limit for the user
	let usageLimit;
	try {
		usageLimit = await Usage.findOne({ userId: session.user.id });
		if (!usageLimit) {
			return res.status(400).json({ success: false, error: "can't get usage limit from the db" });
		}
	} catch (error) {
		console.log(error);
		return res.status(400).json({ success: false, error: error });
	}

	let lastParticipantDate = new Date(Date.now());
	if (usageLimit.trialAccount === true && usageLimit.limitReached) {
		lastParticipantDate = usageLimit.limitReached;
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
				.and({ createdAt: { $lt: lastParticipantDate } })
				.limit(limit)
				.skip(limit * page)
				.sort({ _id: -1 });
		} else {
			participants = await Participant.find({ campaignId: { $in: campaigns } })
				.and({ createdAt: { $lt: lastParticipantDate } })
				.limit(limit)
				.skip(limit * page)
				.sort({ _id: -1 });
		}
		return res.status(200).json({ success: true, data: participants });
	} catch (error) {
		console.log(error);
		return res.status(400).json({ success: false, error: error });
	}
}
