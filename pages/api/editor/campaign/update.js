import mongoose from "mongoose";
import Cors from "cors";
import { getSession } from "next-auth/client";
import initMiddleware from "../../../../lib/InitMiddleware";
import AuthCheck from "../../../../lib/AuthCheck";
import DatabaseConnect from "../../../../lib/DatabaseConnect";
import Campaign from "../../../../models/Campaign";

const cors = initMiddleware(
	Cors({
		methods: ["PUT"],
	})
);

export default async function UpdateHandler(req, res) {
	await cors(req, res);

	const authStatus = await AuthCheck(req, res);
	if (!authStatus) {
		res.end();
		return;
	}

	let campaignId;
	if (req.body.campaignId && req.body.campaignId !== "") {
		// validate campaign id parameter
		if (mongoose.Types.ObjectId.isValid(req.body.campaignId)) {
			campaignId = req.body.campaignId;
		} else {
			res.status(400).json({ success: false, error: "invalid campaign id" });
			return;
		}
	} else {
		res.status(400).json({ success: false, error: "invalid campaign id" });
		return;
	}

	await DatabaseConnect();

	const session = await getSession({ req });

	try {
		const result = await Campaign.findOneAndUpdate({ _id: campaignId, createdBy: session.user.id }, { [req.body.key]: req.body.value });
		if (!result) {
			return res.status(400).json({ success: false });
		}

		return res.status(200).json({ success: true });
	} catch (error) {
		return res.status(400).json({ success: false });
	}
}
