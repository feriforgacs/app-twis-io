import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
	event: {
		type: String,
		required: [true, "event is required"],
		trim: true,
	},
	userId: {
		type: mongoose.Schema.ObjectId,
		ref: "user",
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

export default mongoose.models.Event || mongoose.model("Event", eventSchema);
