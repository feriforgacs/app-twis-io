import mongoose from "mongoose";

const screenSchema = new mongoose.Schema(
	{
		screenId: {
			type: String,
			trim: true,
			required: [true, "Screen ID is required"],
		},
		type: {
			type: String,
			required: [true, "Screen types is required"],
			default: "info",
		},
		orderIndex: {
			type: Number,
			required: [true, "Screen order index is required"],
			default: 0,
		},
		background: {
			type: Object,
			default: {
				type: "solid",
				color: "#ffffff",
			},
		},
		campaignId: {
			type: mongoose.Schema.ObjectId,
			ref: "Campaign",
			required: [true, "Campaign ID is required for screen"],
		},
		createdAt: {
			type: Date,
			default: Date.now,
		},
		updatedAt: {
			type: Date,
			default: Date.now,
		},
	},
	{
		toObject: {
			virtuals: true,
		},
		toJSON: {
			virtuals: true,
		},
	}
);

screenSchema.virtual("screenItems", {
	ref: "ScreenItem",
	localField: "_id",
	foreignField: "screenId",
});

screenSchema.pre("find", function () {
	this.populate("screenItems");
});

screenSchema.pre("findOne", function () {
	this.populate("screenItems");
});

export default mongoose.models.Screen || mongoose.model("Screen", screenSchema);
