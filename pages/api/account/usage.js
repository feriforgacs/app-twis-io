import Cors from "cors";
import { getSession } from "next-auth/client";
import initMiddleware from "../../../lib/InitMiddleware";
import AuthCheck from "../../../lib/AuthCheck";
import DatabaseConnect from "../../../lib/DatabaseConnect";
import Usage from "../../../models/Usage";

const cors = initMiddleware(
	Cors({
		methods: ["GET"],
	})
);

export default async function UsageRequestHandler(req, res) {
	//await cors(req, res);

	const authStatus = await AuthCheck(req, res);
	if (!authStatus) {
		return res.end();
	}

	await DatabaseConnect();
	const session = await getSession({ req });

	try {
		const usage = await Usage.findOne({ userId: session.user.id });
		if (!usage) {
			return res.status(400).json({ success: false, error: "can't get usage data" });
		}
		return res.status(200).json({ success: true, data: usage });
	} catch (error) {
		console.log(error);
		return res.status(400).json({ success: false, error: error });
	}
}
