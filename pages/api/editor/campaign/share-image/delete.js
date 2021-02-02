import Cors from "cors";
import mongoose from "mongoose";
import { getSession } from "next-auth/client";
import { v2 as cloudinary } from "cloudinary";
import initMiddleware from "../../../../../lib/InitMiddleware";
import AuthCheck from "../../../../../lib/AuthCheck";
import Campaign from "../../../../../models/Campaign";

const cors = initMiddleware(
	Cors({
		methods: ["DELETE"],
	})
);

export default async function ShareImageDeleteHandler(req, res) {
	await cors(req, res);

	const authStatus = await AuthCheck(req, res);
	if (!authStatus) {
		res.end();
		return;
	}

	let campaignId;

	if (!req.body.campaignId) {
		return res.status(400).json({ success: false, error: "missing campaign id" });
	}

	if (req.body.campaignId && req.body.campaignId !== "") {
		// validate campaign id parameter
		if (mongoose.Types.ObjectId.isValid(req.body.campaignId)) {
			campaignId = req.body.campaignId;
		} else {
			return res.status(400).json({ success: false, error: "invalid campaign id" });
		}
	} else {
		return res.status(400).json({ success: false, error: "invalid campaign id" });
	}

	const session = await getSession({ req });

	cloudinary.config({
		cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
		api_key: process.env.CLOUDINARY_API_KEY,
		api_secret: process.env.CLOUDINARY_API_SECRET,
	});

	let imagePublicId;

	try {
		// get og image from database
		const campaign = await Campaign.findOne({ _id: campaignId, createdBy: session.user.id });
		if (!campaign) {
			return res.status(400).json({ success: false });
		}

		const imageURLParams = campaign.ogImage.split("/");
		imagePublicId = `twis/uploads/${session.user.id}_share_images/${imageURLParams[imageURLParams.length - 1].split(".")[0]}`;
	} catch (error) {
		return res.status(400).json({ success: false, error });
	}

	try {
		// delete image on cloudinary
		const imageDestroyResult = await cloudinary.uploader.destroy(imagePublicId);
		if (!imageDestroyResult || imageDestroyResult.result !== "ok") {
			return res.status(400).json({ success: false });
		}
	} catch (error) {
		return res.status(400).json({ success: false, error });
	}

	try {
		// update campaign data
		const result = await Campaign.findOneAndUpdate({ _id: campaignId, createdBy: session.user.id }, { ogImage: "" });
		if (!result) {
			return res.status(400).json({ success: false });
		}

		return res.status(200).json({ success: true });
	} catch (error) {
		return res.status(400).json({ success: false, error });
	}
}
