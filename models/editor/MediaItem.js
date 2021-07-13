import mongoose from "mongoose";

const mediaItemSchema = new mongoose.Schema({
	assetId: {
		type: String,
		required: [true, "Asset ID is required"],
		trim: true,
	},
	publicId: {
		type: String,
		required: [true, "Public ID is required"],
		trim: true,
	},
	url: {
		type: String,
		required: [true, "URL is required"],
	},
	secureUrl: {
		type: String,
		required: [true, "Secure URL is required"],
	},
	uploadedBy: {
		type: mongoose.Schema.ObjectId,
		ref: "User",
		required: [true, "User ID is required for screen"],
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

export default mongoose.models.MediaItem || mongoose.model("MediaItem", mediaItemSchema);
