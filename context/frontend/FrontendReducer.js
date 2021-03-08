export default function FrontendReducer(state, action) {
	let selectedAnswers;
	switch (action.type) {
		/**
		 * Update value in state
		 */
		case "UPDATE_STATE":
			return {
				...state,
				[action.payload.key]: action.payload.value,
			};

		/**
		 * Add selected answer to state
		 */
		case "ADD_ANSWER":
			selectedAnswers = { ...state.answers };
			selectedAnswers[`${action.payload.answerId}`] = action.payload.selectedAnswer;

			return {
				...state,
				answers: selectedAnswers,
			};

		default:
			return state;
	}
}
