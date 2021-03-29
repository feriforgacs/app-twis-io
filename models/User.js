import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
	name: {
		type: String,
	},
	email: {
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

export default mongoose.models.User || mongoose.model("User", userSchema);
