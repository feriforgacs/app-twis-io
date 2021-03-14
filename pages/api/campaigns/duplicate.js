import Cors from "cors";
import mongoose from "mongoose";
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
	const session = await getSession({ req });

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
		console.log(error);
		res.status(400).json({ success: false, error });
		return;
	}

	let campaignScreens;
	try {
		campaignScreens = await Screen.find({ campaignId });
		if (!campaignScreens) {
			res.status(400).json({ success: false, error: "can't get campaign screens" });
			return;
		}
	} catch (error) {
		console.log(error);
		res.status(400).json({ success: false, error });
		return;
	}

	let newCampaignData = {
		name: `Copy - ${campaign.name}`,
		type: campaign.type,
		status: campaign.status,
		visibleFrom: campaign.visibleFrom,
		visibleTo: campaign.visibleTo,
		createdBy: session.user.id,
		participantCount: 0,
		ogTitle: campaign.ogTitle,
		ogDescription: campaign.ogDescription,
		ogImage: campaign.ogImage,
		successLimit: campaign.successLimit,
		fonts: campaign.fonts,
	};

	// save new campaign to the db
	let newCampaign;
	try {
		newCampaign = await Campaign.create({ ...newCampaignData });
		if (!newCampaign._id) {
			return res.status(400).json({ success: false, error: "can't create campaign in the db" });
		}
	} catch (error) {
		console.log(error);
		return res.status(400).json({ success: false, error });
	}

	let newCampaignScreensData = [];
	let newCampaignScreenItems = [];
	campaignScreens.map((campaignScreen, index) => {
		newCampaignScreensData[index] = {
			screenId: uuidv4(),
			type: campaignScreen.type,
			orderIndex: campaignScreen.orderIndex,
			background: campaignScreen.background,
			campaignId: newCampaign._id,
		};

		newCampaignScreenItems[campaignScreen.orderIndex] = campaignScreen.screenItems;
	});

	// save new campaign screens to the db
	let newCampaignScreens;
	try {
		newCampaignScreens = await Screen.insertMany(newCampaignScreensData);
		if (!newCampaignScreens) {
			return res.status(400).json({ success: false, error: "can't create screens in the db" });
		}
	} catch (error) {
		console.log(error);
		return res.status(400).json({ success: false, error });
	}

	let newScreenItemsData = [];
	newCampaignScreens.forEach((newScreen) => {
		let newScreenItems = newCampaignScreenItems[newScreen.orderIndex];
		newScreenItems.map((screenItem) => {
			let updatedScreenItem = {
				itemId: uuidv4(),
				type: screenItem.type,
				content: screenItem.content,
				src: screenItem.src,
				orderIndex: screenItem.orderIndex,
				settings: screenItem.settings,
				screenId: newScreen._id,
			};

			newScreenItemsData.push(updatedScreenItem);
		});
	});

	try {
		const newScreenItems = await ScreenItem.insertMany(newScreenItemsData);
		if (!newScreenItems) {
			return res.status(400).json({ success: false, error: "can't create screen items in the db" });
		}
		return res.status(200).json({ success: true });
	} catch (error) {
		console.log(error);
		return res.status(400).json({ success: false });
	}
}
