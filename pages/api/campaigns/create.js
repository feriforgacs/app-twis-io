import Cors from "cors";
import { v4 as uuidv4 } from "uuid";
import slug from "slug";
import { addMonths } from "date-fns";
import { getSession } from "next-auth/client";
import initMiddleware from "../../../lib/InitMiddleware";
import AuthCheck from "../../../lib/AuthCheck";
import DatabaseConnect from "../../../lib/DatabaseConnect";
import Campaign from "../../../models/Campaign";
import Screen from "../../../models/editor/Screen";
import ScreenItem from "../../../models/editor/ScreenItem";
import { StartScreenTemplate, StartScreenTemplateItems } from "../../../utils/screen-templates/StartScreenTemplate";
import { EndScreenSuccessTemplate, EndScreenSuccessTemplateItems } from "../../../utils/screen-templates/EndScreenSuccessTemplate";
import { EndScreenFailureTemplate, EndScreenFailureTemplateItems } from "../../../utils/screen-templates/EndScreenFailureTemplate";
import { QuestionScreenTemplate, QuestionScreenTemplateItems } from "../../../utils/screen-templates/QuestionScreenTemplate";
import { InfoScreenTemplate, InfoScreenTemplateItems } from "../../../utils/screen-templates/InfoScreenTemplate";

const cors = initMiddleware(
	Cors({
		methods: ["POST"],
	})
);

export default async function CampaignCreateHandler(req, res) {
	await cors(req, res);

	const authStatus = await AuthCheck(req, res);
	if (!authStatus) {
		res.end();
		return;
	}

	await DatabaseConnect();

	const { name, type } = req.body;
	const url = `${slug(name).substr(0, 10)}-${Date.now()}`;

	const session = await getSession({ req });

	/**
	 * Save campaign data to the database
	 */
	try {
		const visibleTo = addMonths(new Date(Date.now()), 1);
		const campaign = await Campaign.create({ name, url, type, createdBy: session.user.id, visibleTo });
		if (!campaign._id) {
			return res.status(400).json({ success: false });
		}

		/**
		 * Create start screen, end screen success, end screen failure and first question or other first action screen
		 */
		// create start screen
		const startScreen = StartScreenTemplate;
		startScreen.screenId = uuidv4();
		startScreen.campaignId = campaign._id;

		const startScreenPromise = Screen.create(startScreen);

		// create info screen
		const infoScreen = InfoScreenTemplate;
		infoScreen.screenId = uuidv4();
		infoScreen.campaignId = campaign._id;
		infoScreen.orderIndex = 1;

		const infoscreenPromise = Screen.create(infoScreen);

		// create question screen
		const questionScreen = QuestionScreenTemplate;
		questionScreen.screenId = uuidv4();
		questionScreen.campaignId = campaign._id;
		questionScreen.orderIndex = 2;

		const questionScreenPromise = Screen.create(questionScreen);

		// create end screen success
		const endScreenSuccess = EndScreenSuccessTemplate;
		endScreenSuccess.screenId = uuidv4();
		endScreenSuccess.campaignId = campaign._id;
		endScreenSuccess.orderIndex = 3;

		const endScreenSuccessPromise = Screen.create(endScreenSuccess);

		// create end screen failure
		const endScreenFailure = EndScreenFailureTemplate;
		endScreenFailure.screenId = uuidv4();
		endScreenFailure.campaignId = campaign._id;
		endScreenFailure.orderIndex = 4;

		const endScreenFailurePromise = Screen.create(endScreenFailure);

		const [newStartScreen, newQuestionScreen, newInfoScreen, newEndScreenSuccess, newEndScreenFailure] = await Promise.all([startScreenPromise, questionScreenPromise, infoscreenPromise, endScreenSuccessPromise, endScreenFailurePromise]);

		if (!newStartScreen || !newQuestionScreen || !newInfoScreen || !newEndScreenSuccess || !newEndScreenFailure) {
			return res.status(400).json({ success: false });
		}

		/**
		 * Add default screen items to new screens
		 */
		// start screen items
		let defaultScreenItems;
		const startScreenItems = StartScreenTemplateItems;
		startScreenItems.forEach((item, index) => {
			startScreenItems[index].itemId = uuidv4();
			startScreenItems[index].screenId = newStartScreen._id;
		});

		// info screen items
		const infoScreenItems = InfoScreenTemplateItems;
		infoScreenItems.forEach((item, index) => {
			infoScreenItems[index].itemId = uuidv4();
			infoScreenItems[index].screenId = newInfoScreen._id;
		});

		// question screen items
		const questionScreenItems = QuestionScreenTemplateItems;
		questionScreenItems.forEach((item, index) => {
			questionScreenItems[index].itemId = uuidv4();
			questionScreenItems[index].screenId = newQuestionScreen._id;
		});

		// end screen success items
		const endScreenSuccessItems = EndScreenSuccessTemplateItems;
		endScreenSuccessItems.forEach((item, index) => {
			endScreenSuccessItems[index].itemId = uuidv4();
			endScreenSuccessItems[index].screenId = newEndScreenSuccess._id;
		});

		// end screen failure items
		const endScreenFailureItems = EndScreenFailureTemplateItems;
		endScreenFailureItems.forEach((item, index) => {
			endScreenFailureItems[index].itemId = uuidv4();
			endScreenFailureItems[index].screenId = newEndScreenFailure._id;
		});

		defaultScreenItems = [...startScreenItems, ...questionScreenItems, ...infoScreenItems, ...endScreenSuccessItems, ...endScreenFailureItems];

		const newScreenItems = await ScreenItem.insertMany(defaultScreenItems);

		if (!newScreenItems) {
			return res.status(400).json({ success: false });
		}

		return res.status(200).json({
			success: true,
			data: {
				_id: campaign._id,
			},
		});
	} catch (error) {
		return res.status(400).json({ success: false });
	}
}
