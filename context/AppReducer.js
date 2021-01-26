export default function AppReducer(state, action) {
	let screens;
	let index;
	let data;

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

		/**
		 * ==============================
		 * ======= SCREEN ACTIONS =======
		 * ==============================
		 */
		/**
		 * Add new screen
		 */
		case "ADD_SCREEN":
			screens = [...state.screens];
			index = screens.length - 2; // insert new screen before end screens
			screens.splice(index, 0, action.payload);

			// update order index of last two screens
			screens[screens.length - 2].orderIndex = screens.length - 2; // success end screen
			screens[screens.length - 1].orderIndex = screens.length - 1; // failure end screen

			return {
				...state,
				screens,
			};

		/**
		 * @todo
		 * Update screen item
		 */
		case "UPDATE_SCREEN":
			screens = [...state.screens];
			index = 0;

			if (action.payload.screenId) {
				// find screen index in screens array by screenId
				index = screens.findIndex((obj) => obj.screenId === action.payload.screenId);
			} else {
				// use screen index that was sent with the payload
				index = action.payload.index;
			}

			data = action.payload.data;

			screens[index] = { ...screens[index], ...data };
			return {
				...state,
				screens,
			};

		/**
		 * Remove screen
		 */
		case "REMOVE_SCREEN":
			screens = [...state.screens];
			index = 0;
			if (action.payload.screenId) {
				// find screen index in screens array by screenId
				index = screens.findIndex((obj) => obj.screenId === action.payload.screenId);
			} else {
				// use screen index that was sent with the payload
				index = action.payload.index;
			}
			screens.splice(index, 1);

			// update order index of last two screens
			screens[screens.length - 2].orderIndex = screens.length - 2; // success end screen
			screens[screens.length - 1].orderIndex = screens.length - 1; // failure end screen
			return {
				...state,
				screens,
			};

		/**
		 * ==============================
		 * ======== ITEM ACTIONS ========
		 * ==============================
		 */
		default:
			return state;
	}
}
