import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.ObjectId,
		ref: "User",
		required: [true, "User id is required for subscription"],
	},
	customerId: {
		type: String,
	},
	paymentDate: {
		type: Date,
	},
	subscriptionId: {
		type: String,
	},
	planId: {
		type: String,
	},
	cancelUrl: {
		type: String,
	},
	updateUrl: {
		type: String,
	},
	state: {
		type: String,
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
