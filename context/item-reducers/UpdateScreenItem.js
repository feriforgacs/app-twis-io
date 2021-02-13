export default function UpdateScreenItem(state, action) {
	let screens = [...state.screens];
	// find screen index based on screen id
	let screenIndex = screens.findIndex((obj) => obj.screenId === action.payload.screenId);
	// find item index based on item id
	let itemIndex = screens[screenIndex].screenItems.findIndex((obj) => obj.itemId === action.payload.itemId);

	// update screen item data
	screens[screenIndex].screenItems[itemIndex] = { ...screens[screenIndex].screenItems[itemIndex], ...action.payload.data };

	return {
		...state,
		screens,
	};
}
