export default function UpdateCampaignData(state, action) {
	const saving = action.payload.saving ? action.payload.saving : false;

	return {
		...state,
		saving,
		campaign: {
			...state.campaign,
			[action.payload.key]: action.payload.value,
		},
	};
}
