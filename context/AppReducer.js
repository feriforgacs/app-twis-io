export default function AppReducer(state, action) {
	switch (action.type) {
		/**
		 * Set global error state
		 */
		case "SET_ERROR":
			return {
				...state,
				error: true,
				errorMessage: action.payload.errorMessage,
			};

		/**
		 * Set campaign initial state (when editor loas)
		 */
		case "SET_CAMPAIGN_INITIAL_STATE":
			return {
				...state,
				campaign: action.payload.campaign,
				screens: action.payload.screens,
			};

		default:
			return state;
	}
}
