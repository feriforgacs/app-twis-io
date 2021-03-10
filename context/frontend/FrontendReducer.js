export default function FrontendReducer(state, action) {
	let userAnswers;
	let answerScreenItems;
	let correctAnswers;

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
		 * Count correct answers
		 */
		case "ADD_USER_ANSWER":
			userAnswers = { ...state.userAnswers };
			userAnswers[action.payload.answerId] = action.payload.selectedAnswer;
			correctAnswers = state.correctAnswers;

			if (action.payload.selectedAnswer.correct) {
				correctAnswers += 1;
			}

			return {
				...state,
				userAnswers,
				correctAnswers,
			};

		/**
		 * Add answer screen item options to state
		 * It is used to store randomized answers
		 */
		case "SET_ANSWER_SCREEN_ITEM":
			answerScreenItems = { ...state.answerScreenItems };
			answerScreenItems[action.payload.itemId] = action.payload.answerScreenItem;
			return {
				...state,
				answerScreenItems,
			};

		/**
		 * Restart the quiz
		 */
		case "RESTART_QUIZ":
			return {
				...state,
				activeScreenIndex: 0,
				userAnswers: {},
				answerScreenItems: {},
				correctAnswers: 0,
			};

		default:
			return state;
	}
}
