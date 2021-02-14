export default function UpdateScreenItemOrder(state, action) {
	let screenIndex = state.screens.findIndex((obj) => obj.screenId === action.payload.screenId);
	let itemIndex = state.screens[screenIndex].screenItems.findIndex((obj) => obj.itemId === action.payload.itemId);

	let screenItems = [...state.screens[screenIndex].screenItems];
	let screenItemOrderIndex = screenItems[itemIndex].orderIndex;

	let newOrderIndex;
	let previousItemIndex;
	let nextItemIndex;
	let updatedItems;

	if (action.payload.direction === "forward" && screenItems.length > screenItemOrderIndex + 1) {
		newOrderIndex = screenItems[itemIndex].orderIndex + 1;
		// decrease the order index of the next item in the items array
		nextItemIndex = screenItems.findIndex((obj) => obj.orderIndex === newOrderIndex);
		screenItems[nextItemIndex].orderIndex = newOrderIndex - 1;

		// bring the item forward, increase the order index by one
		screenItems[itemIndex].orderIndex = newOrderIndex;
	} else if (action.payload.direction === "front" && screenItems.length > screenItemOrderIndex + 1) {
		newOrderIndex = screenItems.length - 1;

		// decrese the order index of every item where the order index is higher than the current items order index
		updatedItems = screenItems.map((screenItem) => {
			if (screenItem.orderIndex > screenItemOrderIndex) {
				screenItem.orderIndex = screenItem.orderIndex - 1;
			}
			return screenItem;
		});

		// bring the item to front
		updatedItems[itemIndex].orderIndex = newOrderIndex;
		screenItems = updatedItems;
	} else if (action.payload.direction === "backward" && screenItemOrderIndex > 0) {
		newOrderIndex = screenItems[itemIndex].orderIndex - 1;
		// increase the order index of the previous item in the items array
		previousItemIndex = screenItems.findIndex((obj) => obj.orderIndex === newOrderIndex);
		screenItems[previousItemIndex].orderIndex = newOrderIndex + 1;

		// send the item backward, decrease the order index by one
		screenItems[itemIndex].orderIndex = newOrderIndex;
	} else if (action.payload.direction === "back" && screenItemOrderIndex > 0) {
		newOrderIndex = 0;

		// increase the order index of every item where the order index is smaller than the current items order index
		updatedItems = screenItems.map((screenItem) => {
			if (screenItem.orderIndex < screenItemOrderIndex) {
				screenItem.orderIndex = screenItem.orderIndex + 1;
			}
			return screenItem;
		});

		// send the item to back
		updatedItems[itemIndex].orderIndex = newOrderIndex;
		screenItems = updatedItems;
	}

	/**
	 * @todo move to back
	 */

	let screens = [...state.screens];
	// update changes in state
	screens[screenIndex].screenItems = screenItems;

	return {
		...state,
		activeScreenItem: screenItems[itemIndex],
		screens,
	};
}
