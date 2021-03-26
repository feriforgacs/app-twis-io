import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.ObjectId,
		ref: "User",
		required: [true, "User id is required for subscription"],
	},
	plan: {
		type: String,
		required: [true, "Plan is required for subscription"],
	},
	paymentDate: {
		type: Date,
	},
	subscriptionId: {
		type: Number,
	},
	state: {
		type: String,
	},
	planId: {
		type: Number,
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

export default mongoose.models.Subscription || mongoose.model("Subscription", subscriptionSchema);
