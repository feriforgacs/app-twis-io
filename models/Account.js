import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
	compoundId: {
		type: String,
	},
	userId: {
		type: mongoose.Schema.ObjectId,
		ref: "user",
	},
	providerType: {
		type: String,
	},
	providerId: {
		type: String,
	},
	providerAccountId: {
		type: String,
	},
	refreshToken: {
		type: String,
	},
	accessToken: {
		type: String,
	},
	accessTokenExpires: {
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

export default mongoose.models.Account || mongoose.model("Account", accountSchema);
