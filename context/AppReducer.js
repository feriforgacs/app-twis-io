export default function AppReducer(state, action) {
	switch (action.type) {
		/**
		 * Set critical error state
		 */
		case "SET_CRITICAL_ERROR":
			return {
				...state,
				criticalError: true,
				criticalErrorMessage: action.payload.errorMessage,
			};

		/**
		 * Set error state
		 */
		case "SET_ERROR":
			return {
				...state,
				error: action.payload.error,
				errorMessage: action.payload.errorMessage,
			};

		/**
		 * Set campaign initial state (when editor loas)
		 */
		case "SET_CAMPAIGN_INITIAL_STATE":
			return {
				...state,
				loading: false,
				campaign: action.payload.campaign,
				screens: action.payload.screens,
			};

		/**
		 * Update campaign data in the database
		 */
		case "UPDATE_CAMPAIGN_DATA":
			return {
				...state,
				campaign: {
					...state.campaign,
					[action.payload.key]: action.payload.value,
				},
			};

		default:
			return state;
	}
}
