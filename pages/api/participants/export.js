import mongoose from "mongoose";
import escapeStringRegexp from "escape-string-regexp";
import Cors from "cors";
import ExcelJS from "exceljs";
import { format } from "date-fns";
import { getSession } from "next-auth/client";
import initMiddleware from "../../../lib/InitMiddleware";
import AuthCheck from "../../../lib/AuthCheck";
import EventLog from "../../../lib/EventLog";
import DatabaseConnect from "../../../lib/DatabaseConnect";
import Campaign from "../../../models/Campaign";
import Participant from "../../../models/Participant";
import Usage from "../../../models/Usage";

const cors = initMiddleware(
	Cors({
		methods: ["GET"],
	})
);

export default async function ParticipantExportHandler(req, res) {
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
	if (req.query.campaign && (req.query.campaign !== "" || req.query.campaign !== 0)) {
		// check campaign id format
		if (!mongoose.Types.ObjectId.isValid(req.query.campaign)) {
			res.status(400).send("Invalid campaign ID");
			res.end();
			return;
		}

		try {
			campaigns = await Campaign.find({ createdBy: session.user.id, _id: req.query.campaign }).distinct("_id");
			if (!campaigns.length) {
				res.status(401).send("Not authorized");
				res.end();
				return;
			}
		} catch (error) {
			res.status(400).send("Database error. Please, refresh the page and try again.");
			res.end();
			return;
		}
	} else {
		// get all campaign ids for campaigns that were created by the user
		try {
			campaigns = await Campaign.find({ createdBy: session.user.id }).distinct("_id");
		} catch (error) {
			res.status(400).send("Database error. Please, refresh the page and try again.");
		}
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
	// usage limit only affects trial accounts
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
				.sort({ _id: -1 });
		} else {
			participants = await Participant.find({ campaignId: { $in: campaigns } })
				.and({ createdAt: { $lt: lastParticipantDate } })
				.sort({ _id: -1 });
		}

		const workbook = new ExcelJS.Workbook();
		workbook.creator = "twis.io";

		var worksheet = workbook.addWorksheet("Participants");
		worksheet.columns = [
			{ header: "ID", key: "id", width: 25 },
			{ header: "Created at", key: "created_at", width: 15, style: { numFmt: "dd/mm/yyyy" } },
			{ header: "Name", key: "name", width: 25 },
			{ header: "Email address", key: "email", width: 25 },
			{ header: "Campaign name", key: "campaign_name", width: 25 },
			{ header: "Campaign ID", key: "campaign_id", width: 25 },
		];

		participants.forEach((participant) => {
			worksheet.addRow({ id: participant._id.toString(), created_at: new Date(participant.createdAt), name: participant.name, email: participant.email, campaign_name: participant.campaign.name, campaign_id: participant.campaign._id.toString() });
		});

		res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
		res.setHeader("Content-Disposition", `attachment; filename=twis_participant_export_${format(new Date(), "yyyyMMdd")}.xlsx`);
		const exportResult = await workbook.xlsx.write(res);
		if (exportResult) {
			await EventLog(`participant export - search: ${search} - campaigns: ${campaigns.join()}`, session.user.id, session.user.email);
			res.status(200).end();
			return;
		}
	} catch (error) {
		res.status(400).send("Database error. Please, refresh the page and try again.");
		res.end();
	}
	return;
}
