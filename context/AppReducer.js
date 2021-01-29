export default function AppReducer(state, action) {
	let screens;
	let index;
	let data;
	let screenIndex;
	let itemIndex;
	let screenItems;

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
		 * Set active screen
		 */
		case "SET_ACTIVE_SCREEN":
			return {
				...state,
				activeScreen: action.payload,
			};

		/**
		 * ==============================
		 * ======== ITEM ACTIONS ========
		 * ==============================
		 */

		/**
		 * Add new item to screen
		 */
		case "ADD_SCREEN_ITEM":
			screens = [...state.screens];
			screens[action.payload.screenIndex].screenItems.push(action.payload.newScreenItem);

			return {
				...state,
				screens,
			};

		/**
		 * Update screen item data
		 */
		case "UPDATE_SCREEN_ITEM":
			screens = [...state.screens];
			// use screen index passed along in payload, or find screen index based on screen id
			screenIndex = action.payload.screenIndex !== undefined ? action.payload.screenIndex : screens.findIndex((obj) => obj.screenId === action.payload.screenId);
			// use item index passed along in payload, or find item index based on item id
			itemIndex = action.payload.screenItemIndex !== undefined ? action.payload.screenItemIndex : screens[screenIndex].screenItems.findIndex((obj) => obj.itemId === action.payload.itemId);

			console.log(action.payload.data);
			// update screen item data
			screens[screenIndex].screenItems[itemIndex] = { ...screens[screenIndex].screenItems[itemIndex], ...action.payload.data };

			return {
				...state,
				screens,
			};

		/**
		 * Remove screen item
		 */
		case "REMOVE_SCREEN_ITEM":
			screens = [...state.screens];
			// find screen index based on screen id
			index = screens.findIndex((obj) => obj.screenId === action.payload.screenId);
			// remove screen item based on screen index and screen item id
			screenItems = screens[index].screenItems.filter((screenItem) => screenItem.itemId !== action.payload.itemId);
			screens[index].screenItems = screenItems;

			return {
				...state,
				screens,
			};

		/**
		 * Set active screen item
		 */
		case "SET_ACTIVE_SCREEN_ITEM":
			return {
				...state,
				activeScreenItem: action.payload,
			};
		default:
			return state;
	}
}
