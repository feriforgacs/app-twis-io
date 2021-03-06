import { createContext, useReducer } from "react";
import FrontendReducer from "./FrontendReducer";

let FrontendState = {
	loading: false,
	error: false,
	endScreen: "success",
	activeScreenIndex: 0,
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

	return (
		<FrontendContext.Provider
			value={{
				loading: state.loading,
				error: state.error,
				endScreen: state.endScreen,
				activeScreenIndex: state.activeScreenIndex,

				updateState,
				handleScreenClick,
			}}
		>
			{children}
		</FrontendContext.Provider>
	);
};
