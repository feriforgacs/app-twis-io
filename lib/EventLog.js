import DatabaseConnect from "./DatabaseConnect";
import Event from "../models/Event";

export default async function EventLog(event, userId, userEmail) {
	await DatabaseConnect();

	try {
		await Event.create({
			event,
			userId,
			userEmail,
		});
	} catch (error) {
		console.log(error);
	}
	return;
}
