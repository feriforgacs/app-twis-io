import mongoose from "mongoose";

const screenItemSchema = new mongoose.Schema({
	itemId: {
		type: String,
		required: [true, "Item ID is required"],
		trim: true,
	},
	type: {
		type: String,
		required: [true, "Item type is required"],
		default: "text",
	},
	orderIndex: {
		type: Number,
		required: [true, "Screen item order index is required"],
		default: 0,
	},
	settings: {
		type: Object,
	},
	screenId: {
		type: mongoose.Schema.ObjectId,
		ref: "Screen",
		required: [true, "Screen ID is required for screen item"],
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

export default mongoose.models.ScreenItem || mongoose.model("ScreenItem", screenItemSchema);
