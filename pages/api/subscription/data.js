import Cors from "cors";
import { getSession } from "next-auth/client";
import initMiddleware from "../../../lib/InitMiddleware";
import AuthCheck from "../../../lib/AuthCheck";
import DatabaseConnect from "../../../lib/DatabaseConnect";
import Subscription from "../../../models/Subscription";

const cors = initMiddleware(
	Cors({
		methods: ["GET"],
	})
);

export default async function SubscriptionDataRequest(req, res) {
	await cors(req, res);

	const authStatus = await AuthCheck(req, res);
	if (!authStatus) {
		return res.end();
	}

	await DatabaseConnect();
	const session = await getSession({ req });

	try {
		const subscription = await Subscription.findOne({ userId: session.user.id });
		if (!subscription) {
			return res.status(200).json({ success: true, subscription: null });
		}

		return res.status(200).json({ success: true, subscription });
	} catch (error) {
		console.log(error);
		return res.status(400).json({ success: false, error: error });
	}
}
