export default function SetError(state, action) {
	return {
		...state,
		error: action.payload.error,
		errorMessage: action.payload.errorMessage,
	};
}
