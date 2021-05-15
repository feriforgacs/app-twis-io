import Cors from "cors";
import { Client } from "@sendgrid/client";
import initMiddleware from "../../../lib/InitMiddleware";

const cors = initMiddleware(
	Cors({
		methods: ["DELETE"],
	})
);

export default async function RemoveFromListRequest(req, res) {
	await cors(req, res);

	const client = new Client();
	client.setApiKey(process.env.SENDGRID_KEY);
	const { email, internalSecret } = req.body;

	if (!internalSecret || internalSecret !== process.env.INTERNALSECRET) {
		return res.status(401).json({ success: false, error: "not authorized" });
	}

	/**
	 * Get contact id from sendgrid
	 */
	const contactGetRequest = {
		body: {
			emails: [email],
		},
		method: "POST",
		url: "https://api.sendgrid.com/v3/marketing/contacts/search/emails",
	};

	let contactId;
	try {
		const contact = await client.request(contactGetRequest);
		const [, body] = contact;

		if (body.result[email].contact.id && body.result[email].contact.list_ids.includes(process.env.SENDGRID_LIST_ID)) {
			contactId = body.result[email].contact.id;
		} else {
			return res.status(200).json({ success: true });
		}
	} catch (error) {
		console.log("can't get contact information from sendgrid", error);
		return res.status(error.code).send(error.message);
	}

	/**
	 * No contact found
	 */
	if (!contactId) {
		return res.status(200).json({ success: true });
	}

	/**
	 * Delete contact
	 */
	const contactDeleteRequest = {
		method: "DELETE",
		url: `https://api.sendgrid.com/v3/marketing/contacts?ids=${contactId}`,
	};
	try {
		await client.request(contactDeleteRequest);
		return res.status(200).json({ success: true });
	} catch (error) {
		console.log("can't remove contact from sendgrid", error);
		return res.status(error.code).send(error.message);
	}
}
