export default function SetMoveableDisabled(state, action) {
	return {
		...state,
		moveableDisabled: action.payload,
	};
}
