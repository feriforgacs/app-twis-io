import Cors from "cors";
import { getSession } from "next-auth/client";
import { addMonths } from "date-fns";
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

	/**
	 * @todo get params
	 * @todo send cancel request to paddle api
	 * @todo remove subscription from the db
	 */
}
