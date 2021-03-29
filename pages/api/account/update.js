import Cors from "cors";
import { getSession } from "next-auth/client";
import initMiddleware from "../../../lib/InitMiddleware";
import AuthCheck from "../../../lib/AuthCheck";
import DatabaseConnect from "../../../lib/DatabaseConnect";
import User from "../../../models/User";

const cors = initMiddleware(
	Cors({
		methods: ["POST"],
	})
);

export default async function AccountUpdateHandler(req, res) {
	await cors(req, res);

	const authStatus = await AuthCheck(req, res);
	if (!authStatus) {
		return res.end();
	}

	await DatabaseConnect();
	const session = await getSession({ req });

	// check name
	const name = req.body.name;
	if (!name) {
		return res.status(400).json({ success: false, error: "missing name value" });
	}

	try {
		const updatedUser = await User.findOneAndUpdate({ _id: session.user.id }, { name });
		if (!updatedUser) {
			return res.status(400).json({ success: false, error: "can't update user" });
		}
		return res.status(200).json({ success: true });
	} catch (error) {
		console.log(error);
		return res.status(400).json({ success: false, error: error });
	}
}
