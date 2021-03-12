import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema({
	name: {
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
	/* dataCollectionType: {
		type: String,
		default: "form",
	},
	dataCollectionSuccessAction: {
		type: String,
		default: "popup",
	},
	dataCollectionSuccessPopupContent: {
		type: String,
		default: "Thank your for filling the form. We’ll get in touch with you if you are one of our lucky winners. Meanwhile, don’t forget to follow us on Instagram and feel free to visit our website as well.",
	},
	dataCollectionSuccessRedirectURL: {
		type: String,
		default: "https://",
		trim: true,
	},
	dataCollectionErrorMessage: {
		type: String,
		default: "There was an error during the process. Please, wait a few seconds and try again.",
	}, */
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
