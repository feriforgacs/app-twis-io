import escapeStringRegexp from "escape-string-regexp";
import Cors from "cors";
import { getSession } from "next-auth/client";
import initMiddleware from "../../../lib/InitMiddleware";
import AuthCheck from "../../../lib/AuthCheck";
import DatabaseConnect from "../../../lib/DatabaseConnect";
import Participant from "../../../models/Participant";
import Campaign from "../../../models/Campaign";
import mongoose from "mongoose";

const cors = initMiddleware(
	Cors({
		methods: ["GET"],
	})
);

export default async function ParticipantCountHandler(req, res) {
	await cors(req, res);

	const authStatus = await AuthCheck(req, res);
	if (!authStatus) {
		res.end();
		return;
	}

	await DatabaseConnect();
	const session = await getSession({ req });

	let campaignId;
	if (req.query.campaign && req.query.campaign !== "") {
		// validate campaign id parameter
		if (mongoose.Types.ObjectId.isValid(req.query.campaign)) {
			campaignId = req.query.campaign;
		} else {
			res.status(400).json({ success: false, error: "invalid campaign id" });
			return;
		}
	}

	// check search query in the params
	let search = "";
	if (req.query.search && req.query.search !== "") {
		search = escapeStringRegexp(req.query.search);
	}

	let campaigns;
	if (campaignId) {
		// check campaign and user connection
		try {
			const campaign = await Campaign.countDocuments({ _id: campaignId, createdBy: session.user.id });
			if (!campaign) {
				res.status(400).json({ success: false, error: "not authorized" });
				return;
			} else {
				campaigns = [campaignId];
			}
		} catch (error) {
			res.status(400).json({ success: false, error });
			return;
		}
	} else {
		// get the ids of all campaigns created by the user
		try {
			campaigns = await Campaign.find({ createdBy: session.user.id }).distinct("_id");
		} catch (error) {
			res.status(400).json({ success: false, error });
		}
	}

	// get all participant count, or count participants by campaign id
	try {
		let participants;
		if (search !== "") {
			participants = await Participant.countDocuments({
				$and: [
					{ campaignId: { $in: campaigns } },
					{
						$or: [
							{
								name: { $regex: search, $options: "i" },
							},
							{
								email: { $regex: search, $options: "i" },
							},
						],
					},
				],
			});
		} else {
			participants = await Participant.countDocuments({ campaignId: { $in: campaigns } });
		}
		res.status(200).json({ success: true, data: participants });
	} catch (error) {
		res.status(400).json({ success: false, error });
	}
	return;
}
