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
			console.log(action.payload.answerId, action.payload.selectedAnswer);
			selectedAnswers = { ...state.answers };
			selectedAnswers[`${action.payload.answerId}`] = action.payload.selectedAnswer;

			console.log(selectedAnswers);

			return {
				...state,
				answers: selectedAnswers,
			};

		default:
			return state;
	}
}
