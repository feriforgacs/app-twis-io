import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema({
	name: {
		/** The name of the campaign */
		type: String,
		trim: true,
		required: [true, "Please, provide a name for this campaign"],
		minlength: [2, "Campaign name should be at least 2 characters long"],
		maxlength: [250, "Campaign name cannot be longer than 250 characters"],
	},
	type: {
		type: String,
		default: "quiz",
	},
	status: {
		type: String,
		default: "draft",
	},
	visibleFrom: {
		type: Date,
		default: Date.now,
	},
	visibleTo: {
		type: Date,
		default: Date.now,
	},
	createdBy: {
		type: mongoose.Schema.ObjectId,
		ref: "user",
		required: [true, "You must supply a user for the campaign"],
	},
	participantCount: {
		type: Number,
		default: 0,
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

campaignSchema.index({
	name: "text",
});

export default mongoose.models.Campaign || mongoose.model("Campaign", campaignSchema);
