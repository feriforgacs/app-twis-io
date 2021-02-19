export default function SetActiveScreen(state, action) {
	return {
		...state,
		activeScreen: action.payload,
		formResultPreview: "",
		moveableDisabled: false,
	};
}
