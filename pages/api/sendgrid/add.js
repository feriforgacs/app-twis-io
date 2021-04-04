import Cors from "cors";
import { Client } from "@sendgrid/client";
import initMiddleware from "../../../lib/InitMiddleware";

const cors = initMiddleware(
	Cors({
		methods: ["PUT"],
	})
);

export default async function (req, res) {
	await cors(req, res);

	const client = new Client();
	client.setApiKey(process.env.SENDGRID_KEY);
	const { email } = req.body;

	const requestBody = {
		list_ids: [process.env.SENDGRID_LIST_ID],
		contacts: [
			{
				email: email,
			},
		],
	};

	const request = {
		body: requestBody,
		method: "PUT",
		url: "https://api.sendgrid.com/v3/marketing/contacts",
	};

	try {
		await client.request(request);
		res.status(200).send("done");
	} catch (error) {
		console.log("ERROR - SG Add Contact", error);
		res.status(error.code).send(error.message);
	}
}
