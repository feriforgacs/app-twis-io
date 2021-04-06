import mongoose from "mongoose";

const usageSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.ObjectId,
		ref: "User",
		required: [true, "User id is required for usage"],
	},
	value: {
		type: Number,
		default: 0,
	},
	limit: {
		type: Number,
		default: 10,
	},
	limitReached: {
		type: Date,
	},
	trialAccount: {
		type: Boolean,
		default: true,
	},
	renewDate: {
		type: Date,
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

export default mongoose.models.Usage || mongoose.model("Usage", usageSchema);
