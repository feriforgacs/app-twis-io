export default function SetFormResultPreview(state, action) {
	return {
		...state,
		formResultPreview: action.payload,
		moveableDisabled: action.payload !== "",
	};
}
