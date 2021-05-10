import Cors from "cors";
import axios from "axios";
import { addMonths } from "date-fns";
import initMiddleware from "../../../../lib/InitMiddleware";
import DatabaseConnect from "../../../../lib/DatabaseConnect";
import Usage from "../../../../models/Usage";
import Subscription from "../../../../models/Subscription";

const cors = initMiddleware(
	Cors({
		methods: ["GET"],
	})
);

export default async function ResetUsageHandler(req, res) {}
