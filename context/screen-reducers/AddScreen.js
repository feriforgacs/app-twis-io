export default function AddScreen(state, action) {
	let screens = [...state.screens];
	let index = screens.length - 2; // insert new screen before end screens
	screens.splice(index, 0, action.payload.newScreen);

	// update order index of last two screens
	screens[screens.length - 2].orderIndex = screens.length - 2; // success end screen
	screens[screens.length - 1].orderIndex = screens.length - 1; // failure end screen

	const saving = action.payload.saving ? action.payload.saving : false;

	return {
		...state,
		saving,
		screens,
	};
}
