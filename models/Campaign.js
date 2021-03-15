import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema({
	name: {
		type: String,
		trim: true,
		required: [true, "Please, provide a name for this campaign"],
		minlength: [2, "Campaign name should be at least 2 characters long"],
		maxlength: [250, "Campaign name cannot be longer than 250 characters"],
	},
	url: {
		type: String,
		trim: true,
		required: [true, "Campaign URL is required"],
		minlength: [5, "Campaign URL should be at least 5 characters long"],
		maxlength: [250, "Campaign URL cannot be longer than 250 characters"],
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
	ogTitle: {
		type: String,
		trim: true,
		default: "",
	},
	ogDescription: {
		type: String,
		trim: true,
		default: "",
	},
	ogImage: {
		type: String,
		default: "",
	},
	successLimit: {
		type: Number,
		default: 0,
	},
	fonts: {
		type: Array,
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

export default mongoose.models.Campaign || mongoose.model("Campaign", campaignSchema);
