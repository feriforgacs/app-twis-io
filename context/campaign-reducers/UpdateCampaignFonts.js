export default function UpdateCampaignFonts(state, action) {
	let campaignFonts = [...state.campaign.fonts];
	campaignFonts.push(action.payload);
	return {
		...state,
		campaign: {
			...state.campaign,
			fonts: campaignFonts,
		},
	};
}
