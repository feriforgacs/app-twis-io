export default function FrontendReducer(state, action) {
	let userAnswers;
	let answerScreenItems;

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
		case "ADD_USER_ANSWER":
			userAnswers = { ...state.userAnswers };
			userAnswers[action.payload.answerId] = action.payload.selectedAnswer;

			return {
				...state,
				userAnswers,
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

		default:
			return state;
	}
}
