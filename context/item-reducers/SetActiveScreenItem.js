export default function SetActiveScreenItem(state, action) {
	return {
		...state,
		activeScreenItem: action.payload,
		formResultPreview: "",
		moveableDisabled: false,
	};
}
