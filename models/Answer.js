import mongoose from "mongoose";

const answerSchema = new mongoose.Schema(
	{
		participantId: {
			type: mongoose.Schema.ObjectId,
			ref: "Participant",
			required: [true, "Participant ID is required for answer"],
		},
		campaignId: {
			type: mongoose.Schema.ObjectId,
			ref: "Campaign",
			required: [true, "Campaign ID is required for answer"],
		},
		answers: {
			type: Array,
		},
		createdAt: {
			type: Date,
			default: Date.now,
		},
		updatedAt: {
			type: Date,
			default: Date.now,
		},
	},
	{
		toObject: { virtuals: true },
		toJSON: { virtuals: true },
	}
);

export default mongoose.models.Answer || mongoose.model("Answer", answerSchema);
