import Cors from "cors";
import { getSession } from "next-auth/client";
import axios from "axios";
import initMiddleware from "../../../lib/InitMiddleware";
import AuthCheck from "../../../lib/AuthCheck";
import DatabaseConnect from "../../../lib/DatabaseConnect";
import Subscription from "../../../models/Subscription";

const cors = initMiddleware(
	Cors({
		methods: ["POST"],
	})
);

export default async function CancelSubscriptionHandler(req, res) {
	await cors(req, res);

	const authStatus = await AuthCheck(req, res);
	if (!authStatus) {
		return res.end();
	}

	await DatabaseConnect();
	const session = await getSession({ req });

	const subscriptionId = req.body.subscriptionId;
	if (!subscriptionId) {
		return res.status(400).json({ success: false, error: "missing subscriptionId value" });
	}

	try {
		const cancelRequest = await axios.post(
			`${process.env.PADDLE_API_ENDPOINT}subscription/users_cancel`,
			{
				vendor_id: process.env.NEXT_PUBLIC_PADDLE_VENDOR_ID,
				vendor_auth_code: process.env.PADDLE_AUTH_CODE,
				subscription_id: subscriptionId,
			},
			{
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
			}
		);

		const { success, response } = JSON.parse(cancelRequest.data);

		if (!success) {
			return res.status(400).json({ success: false, error: response });
		}
	} catch (error) {
		console.log(error);
		return res.status(400).json({ success: false, error: error });
	}

	/**
	 * Update subscription in the db to cancelled
	 */
	try {
		const subscriptionUpdate = await Subscription.findOneAndUpdate({ userId: session.user.id }, { status: "cancelled", updatedAt: Date.now() });

		if (!subscriptionUpdate) {
			return res.status(400).json({ success: false, error: "can't update subscription document in the db" });
		}

		return res.status(200).json({ success: true });
	} catch (error) {
		console.log(error);
		return res.status(400).json({ success: false, error: error });
	}
}
