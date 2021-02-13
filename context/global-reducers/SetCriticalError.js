export default function SetCriticalError(state, action) {
	return {
		...state,
		criticalError: true,
		criticalErrorMessage: action.payload.errorMessage,
	};
}
