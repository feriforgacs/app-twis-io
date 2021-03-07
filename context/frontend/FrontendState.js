import { createContext, useReducer } from "react";
import FrontendReducer from "./FrontendReducer";

let FrontendState = {
	loading: false,
	error: false,
	endScreen: "success",
	activeScreenIndex: 0,
	noStep: false,
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
		if (e.pageX >= window.innerWidth * 0.45) {
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

	return (
		<FrontendContext.Provider
			value={{
				loading: state.loading,
				error: state.error,
				endScreen: state.endScreen,
				activeScreenIndex: state.activeScreenIndex,

				updateState,
				handleScreenClick,
				gotoNextScreen,
				gotoPreviousScreen,
			}}
		>
			{children}
		</FrontendContext.Provider>
	);
};
