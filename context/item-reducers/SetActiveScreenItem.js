export default function SetActiveScreenItem(state, action) {
	const formResultPreview = action.payload.type === "form" ? state.formResultPreview : "";
	return {
		...state,
		activeScreenItem: action.payload,
		formResultPreview,
	};
}
