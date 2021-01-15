import DatabaseConnect from "./DatabaseConnect";
import Event from "../models/Event";

export default async function EventLog(event, userId) {
	await DatabaseConnect();

	try {
		await Event.create({
			event,
			userId,
		});
	} catch (error) {
		console.log(error);
	}
	return;
}
