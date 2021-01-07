import mongoose from "mongoose";

const participantSchema = new mongoose.Schema({
	generatedId: {
		type: String,
		trim: true,
		required: [true, "Participant generated ID is required"],
	},
	name: {
		type: String,
		trim: true,
	},
	email: {
		type: String,
		trim: true,
	},
	campaignId: {
		type: mongoose.Schema.ObjectId,
		ref: "Campaign",
		required: [true, "Campaign ID is required for participant"],
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
});

export default mongoose.models.Participant || mongoose.model("Participant", participantSchema);
