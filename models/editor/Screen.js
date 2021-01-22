import mongoose from "mongoose";

const screenSchema = new mongoose.Schema({
	type: {
		type: String,
		required: [true, "Screen types is required"],
		default: "info",
	},
	orderIndex: {
		type: Number,
		required: [true, "Screen order index is required"],
		default: 0,
	},
	background: {
		type: String,
		default: "#ffffff",
	},
	campaignId: {
		type: mongoose.Schema.ObjectId,
		ref: "Campaign",
		required: [true, "Campaign ID is required for participant"],
	},
	createdBy: {
		type: mongoose.Schema.ObjectId,
		ref: "user",
		required: [true, "You must supply a user for the campaign"],
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

export default mongoose.models.Screen || mongoose.model("Screen", screenSchema);
