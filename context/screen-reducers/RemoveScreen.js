export default function RemoveScreen(state, action) {
	let screens = [...state.screens];

	// find screen index in screens array by screenId
	let index = screens.findIndex((obj) => obj.screenId === action.payload.screenId);

	if (!index === -1) {
		return {
			...state,
		};
	}

	// remove screen from state
	screens.splice(index, 1);

	// update order index of screens that are following the removed screen
	for (index; index < screens.length; index++) {
		screens[index].orderIndex = index;
	}

	/* if (state.activeScreen.screenId === action.payload.screenId) {
		// unset active screen
		return {
			...state,
			activeScreen: "",
			activeScreenItem: "",
			screens,
		};
	} */

	const saving = action.payload.saving ? action.payload.saving : false;

	return {
		...state,
		saving,
		activeScreen: "",
		activeScreenItem: "",
		screens,
	};
}
