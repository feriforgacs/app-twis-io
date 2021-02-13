export default function UpdateScreen(state, action) {
	let screens = [...state.screens];
	let index = screens.findIndex((obj) => obj.screenId === action.payload.screenId);

	if (!index === -1) {
		return {
			...state,
		};
	}

	let data = action.payload.data;

	screens[index] = { ...screens[index], ...data };
	return {
		...state,
		screens,
	};
}
