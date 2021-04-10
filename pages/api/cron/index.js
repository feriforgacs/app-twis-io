import Cors from "cors";
import initMiddleware from "../../../lib/InitMiddleware";
import DatabaseConnect from "../../../lib/DatabaseConnect";

const cors = initMiddleware(
	Cors({
		methods: ["POST"],
	})
);

export default async function CronRequestHandler(req, res) {}
