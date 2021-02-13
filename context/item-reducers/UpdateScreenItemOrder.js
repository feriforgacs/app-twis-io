export default function UpdateScreenItemOrder(state, action) {
	let screenIndex = state.screens.findIndex((obj) => obj.screenId === action.payload.screenId);
	let itemIndex = state.screens[screenIndex].screenItems.findIndex((obj) => obj.itemId === action.payload.itemId);

	let screenItems = [...state.screens[screenIndex].screenItems];
	let screenItemOrderIndex = screenItems[itemIndex].orderIndex;

	if (action.payload.direction === "forward" && screenItems.length > screenItemOrderIndex + 1) {
		// move the item forward, increase the order index by one
		screenItems[itemIndex].orderIndex = screenItems[itemIndex].orderIndex + 1;
		// decrease the order index of the previous item in the array
		screenItems[itemIndex + 1].orderIndex = screenItems[itemIndex + 1].orderIndex - 1;
	}

	let screens = [...state.screens];
	// update changes in state
	screens[screenIndex].screenItems = screenItems;
	/**
	 * @todo update active screen item
	 */

	return {
		...state,
		activeScreenItem: screenItems[itemIndex],
		screens,
	};
}
