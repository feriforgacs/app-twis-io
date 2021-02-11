import Cors from "cors";
import { v4 as uuidv4 } from "uuid";
import { getSession } from "next-auth/client";
import initMiddleware from "../../../lib/InitMiddleware";
import AuthCheck from "../../../lib/AuthCheck";
import DatabaseConnect from "../../../lib/DatabaseConnect";
import Campaign from "../../../models/Campaign";
import Screen from "../../../models/editor/Screen";

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

	const session = await getSession({ req });

	/**
	 * Save campaign data to the database
	 */
	try {
		const campaign = await Campaign.create({ name, type, createdBy: session.user.id });
		if (!campaign._id) {
			return res.status(400).json({ success: false });
		}

		/**
		 * Create start screen, end screen success, end screen failure and first question or other first action screen
		 */
		// create start screen
		const startScreen = {
			screenId: uuidv4(),
			type: "start",
			orderIndex: 0,
			background: {
				type: "gradient",
				color: "linear-gradient(135.57deg, rgb(164, 38, 184) 0%, rgb(78, 156, 239) 93.45%)",
			},
			campaignId: campaign._id,
		};

		const startScreenPromise = Screen.create(startScreen);

		// create end screen success
		const endScreenSuccess = {
			screenId: uuidv4(),
			type: "endSuccess",
			orderIndex: 1,
			background: {
				type: "gradient",
				color: "linear-gradient(rgb(15, 191, 33), rgb(10, 206, 171))",
			},
			campaignId: campaign._id,
		};

		const endScreenSuccessPromise = Screen.create(endScreenSuccess);

		// create end screen failure
		const endScreenFailure = {
			screenId: uuidv4(),
			type: "endFailure",
			orderIndex: 2,
			background: {
				type: "gradient",
				color: "linear-gradient(rgb(191, 68, 15), rgb(206, 22, 10))",
			},
			campaignId: campaign._id,
		};

		const endScreenFailurePromise = Screen.create(endScreenFailure);

		await Promise.all([startScreenPromise, endScreenSuccessPromise, endScreenFailurePromise]);

		/**
		 * @todo create campaign specific default screens - eg forst question screen for a quiz
		 */

		/**
		 * @todo create default screen items
		 */

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
