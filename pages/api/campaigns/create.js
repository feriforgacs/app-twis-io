import Cors from "cors";
import { getSession } from "next-auth/client";
import initMiddleware from "../../../lib/InitMiddleware";
import AuthCheck from "../../../lib/AuthCheck";
import DatabaseConnect from "../../../lib/DatabaseConnect";
import Campaign from "../../../models/Campaign";

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

		res.status(200).json({
			success: true,
			data: {
				_id: campaign._id,
			},
		});
	} catch (error) {
		res.status(400).json({ success: false });
	}
}
