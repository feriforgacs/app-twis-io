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
	checkoutId: {
		type: String,
	},
	productId: {
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
	overagesPrice: {
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
