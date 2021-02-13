export default function UpdateCampaignData(state, action) {
	return {
		...state,
		campaign: {
			...state.campaign,
			[action.payload.key]: action.payload.value,
		},
	};
}
