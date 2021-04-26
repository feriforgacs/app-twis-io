import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.ObjectId,
		ref: "User",
		required: [true, "User id is required for subscription"],
	},
	plan: {
		type: String,
		required: [true, "Subscription plan is required"],
	},
	panTerm: {
		type: String,
		required: [true, "Subscription term is required"],
	},
	customerId: {
		type: String,
		required: [true, "Customer ID is required"],
	},
	paymentDate: {
		type: Date,
	},
	checkoutId: {
		type: String,
		required: [true, "Checkout ID is required"],
	},
	subscriptionId: {
		type: Number,
		required: [true, "Subscription ID is required"],
	},
	orderId: {
		type: Number,
		required: [true, "Subscription ID is required"],
	},
	productId: {
		type: String,
		required: [true, "Product ID is required"],
	},
	cancelUrl: {
		type: String,
	},
	updateUrl: {
		type: String,
	},
	status: {
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
