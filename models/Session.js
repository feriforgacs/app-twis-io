import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.ObjectId,
		ref: "user",
	},
	expires: {
		type: Date,
	},
	sessionToken: {
		type: String,
	},
	accessToken: {
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

export default mongoose.models.Session || mongoose.model("Session", sessionSchema);
