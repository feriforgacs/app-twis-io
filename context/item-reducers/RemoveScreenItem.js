export default function RemoveScreenItem(state, action) {
	let screens = [...state.screens];
	// find screen index based on screen id
	let screenIndex = screens.findIndex((obj) => obj.screenId === action.payload.screenId);
	let itemIndex = screens[screenIndex].screenItems.findIndex((obj) => obj.itemId === action.payload.itemId);
	let currentScreenItem = screens[screenIndex].screenItems[itemIndex];

	// remove screen item based on screen index and screen item id
	// the screen item id is not the db id, but the generated uuid
	let screenItemsTemp = screens[screenIndex].screenItems.filter((screenItem) => screenItem.itemId !== action.payload.itemId);

	// change items order index
	let screenItems = screenItemsTemp.map((screenItem) => {
		if (screenItem.orderIndex > currentScreenItem.orderIndex) {
			return {
				...screenItem,
				orderIndex: screenItem.orderIndex - 1,
			};
		} else {
			return { ...screenItem };
		}
	});

	screens[screenIndex].screenItems = screenItems;

	return {
		...state,
		activeScreenItem: "",
		activeScreen: "",
		screens,
	};
}
