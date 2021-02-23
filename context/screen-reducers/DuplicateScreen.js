export default function DuplicateScreen(state, action) {
	let screens = [...state.screens];

	// find screen index based in screen uuid
	let index = screens.findIndex((obj) => obj.screenId === action.payload.screenId);

	if (!index === -1) {
		return {
			...state,
		};
	}

	// add new screen item to state after index
	screens.splice(index + 1, 0, action.payload.newScreenData);

	// update order index of screens that are following the duplicated screen
	for (index + 2; index < screens.length; index++) {
		screens[index].orderIndex = index;
	}

	return {
		...state,
		screens,
		activeScreenItem: "",
	};
}
