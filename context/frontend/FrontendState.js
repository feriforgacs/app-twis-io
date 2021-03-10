import { createContext, useReducer } from "react";
import FrontendReducer from "./FrontendReducer";

let FrontendState = {
	loading: false,
	error: false,
	endScreen: "success",
	activeScreenIndex: 0,
	noStep: false,
	userAnswers: {},
	answerScreenItems: {}, // this is necessary to store randomized answer options
	correctAnswers: 0,
};

export const FrontendContext = createContext(FrontendState);

export const FrontendProvider = ({ children }) => {
	const [state, dispatch] = useReducer(FrontendReducer, FrontendState);

	/**
	 * Update the value of an item in state
	 * @param {string} key Key of the item in state
	 * @param {string|obj|bool|arr} value Value of the item to be updated to
	 */
	const updateState = (key, value) => {
		dispatch({
			type: "UPDATE_STATE",
			payload: {
				key,
				value,
			},
		});
	};

	/**
	 * Go to next or previous screen based on click location
	 * @param {obj} e Click event object
	 * @param {int} lastScreenIndex The index of the last campaign screen
	 */
	const handleScreenClick = (e, lastScreenIndex) => {
		if (e.target.classList.contains("no-step") || state.noStep) {
			return;
		}
		if (e.pageX >= window.innerWidth * 0.35) {
			if (state.activeScreenIndex < lastScreenIndex) {
				// go to next screen
				updateState("activeScreenIndex", state.activeScreenIndex + 1);
			}
		} else {
			if (state.activeScreenIndex > 0) {
				// go to previous screen
				updateState("activeScreenIndex", state.activeScreenIndex - 1);
			}
		}
	};

	/**
	 * Go to next screen
	 * @param {int} lastScreenIndex Index of last screen in the campaign
	 */
	const gotoNextScreen = (lastScreenIndex) => {
		if (state.activeScreenIndex < lastScreenIndex) {
			// go to next screen
			updateState("activeScreenIndex", state.activeScreenIndex + 1);
		}
	};

	/**
	 * Go to previous screen
	 */
	const gotoPreviousScreen = () => {
		if (state.activeScreenIndex > 0) {
			// go to previous screen
			updateState("activeScreenIndex", state.activeScreenIndex - 1);
		}
	};

	/**
	 * Set the selected answer
	 * @param {string} answerId Answer's id
	 * @param {obj} selectedAnswer Selected answer object
	 */
	const addUserAnswer = (answerId, selectedAnswer) => {
		dispatch({
			type: "ADD_USER_ANSWER",
			payload: {
				answerId,
				selectedAnswer,
			},
		});
	};

	/**
	 * Add answer item options to state
	 * This is used to store random answer order
	 * @param {string} itemId Answer item id (generated uuid)
	 * @param {object} answerScreenItem Answer item answer options
	 */
	const setAnswerScreenItem = (itemId, answerScreenItem) => {
		dispatch({
			type: "SET_ANSWER_SCREEN_ITEM",
			payload: {
				itemId,
				answerScreenItem,
			},
		});
	};

	/**
	 * Restart quiz from first scree
	 */
	const restartQuiz = () => {
		dispatch({
			type: "RESTART_QUIZ",
			payload: "restart",
		});
	};

	return (
		<FrontendContext.Provider
			value={{
				loading: state.loading,
				error: state.error,
				endScreen: state.endScreen,
				activeScreenIndex: state.activeScreenIndex,
				userAnswers: state.userAnswers,
				answerScreenItems: state.answerScreenItems,
				correctAnswers: state.correctAnswers,

				updateState,
				handleScreenClick,
				gotoNextScreen,
				gotoPreviousScreen,
				addUserAnswer,
				setAnswerScreenItem,
				restartQuiz,
			}}
		>
			{children}
		</FrontendContext.Provider>
	);
};
