import mongoose from "mongoose";

const participantSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			trim: true,
		},
		email: {
			type: String,
			trim: true,
		},
		campaignId: {
			type: mongoose.Schema.ObjectId,
			ref: "Campaign",
			required: [true, "Campaign ID is required for participant"],
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
		toObject: { virtuals: true },
		toJSON: { virtuals: true },
	}
);

participantSchema.virtual("campaign", {
	ref: "Campaign",
	localField: "campaignId",
	foreignField: "_id",
	justOne: true,
	options: {
		select: "_id name createdBy",
	},
});

participantSchema.pre("find", function () {
	this.populate("campaign");
});

participantSchema.pre("findOne", function () {
	this.populate("campaign");
});

export default mongoose.models.Participant || mongoose.model("Participant", participantSchema);
