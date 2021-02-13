export default function SetCampaignInitialState(state, action) {
	return {
		...state,
		loading: false,
		campaign: action.payload.campaign,
		screens: action.payload.screens,
	};
}
