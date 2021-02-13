export default function AddScreenItem(state, action) {
	let screens = [...state.screens];
	// find screen index in screens array by screenId
	let index = screens.findIndex((obj) => obj.screenId === action.payload.newScreenItem.screenId);

	if (!index === -1) {
		return {
			...state,
		};
	}

	screens[index].screenItems.push(action.payload.newScreenItem);

	return {
		...state,
		screens,
	};
}
