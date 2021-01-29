import { createContext, useReducer } from "react";
import axios from "axios";
import AppReducer from "./AppReducer";

let InitialState = {
	loading: true,
	saving: false,
	systemMessage: "",
	error: false,
	errorMessage: "",
	ciritcalError: false,
	criticalErrorMessage: "😢  An error occured. Please, refresh the page and try again.",
	activeScreen: "",
	activeScreenItem: "",
	activeItemSettings: "",
	campaign: {},
	screens: [],
};

export const GlobalContext = createContext(InitialState);

export const GlobalProvider = ({ children }) => {
	const [state, dispatch] = useReducer(AppReducer, InitialState);

	// Actions
	/**
	 * Set error status and error message in global state
	 * @param {bool} errorStatus Error status - true: there is an error, false: no error, or error msg closed
	 * @param {string} errorMessage Error message
	 */
	const setError = (errorStatus, errorMessage) => {
		dispatch({
			type: "SET_ERROR",
			payload: {
				error: errorStatus,
				errorMessage: errorMessage,
			},
		});
	};
	/**
	 * Get campaign data from the database
	 * @param {string} campaignId Campaign mongodb id
	 */
	const loadCampaignData = async (campaignId) => {
		let source = axios.CancelToken.source();

		try {
			const result = await axios(`${process.env.APP_URL}/api/editor/campaign/data?id=${campaignId}`, { cancelToken: source.token });

			if (result.data.success !== true) {
				console.log(result);
				dispatch({
					type: "SET_CRITICAL_ERROR",
					payload: {
						errorMessage: "Can't get campaign data from the database",
					},
				});
				return;
			}

			dispatch({
				type: "SET_CAMPAIGN_INITIAL_STATE",
				payload: {
					campaign: result.data.campaign,
					screens: result.data.screens,
				},
			});
			return;
		} catch (error) {
			if (axios.isCancel(error)) {
				return;
			}

			console.log(error);
			dispatch({
				type: "SET_CRITICAL_ERROR",
				payload: {
					errorMessage: "Can't get campaign data from the database",
				},
			});
			return;
		}
	};

	/**
	 * Update campaign data in the database, based on key value pair
	 * @param {string} key The key of the field to update
	 * @param {string} value The value of the field to update to
	 */
	const updateCampaignData = async (key, value) => {
		let source = axios.CancelToken.source();

		try {
			const result = await axios.put(
				`${process.env.APP_URL}/api/editor/campaign/update`,
				{
					campaignId: state.campaign._id,
					key,
					value,
				},
				{
					headers: {
						"Content-Type": "application/json",
					},
				},
				{ cancelToken: source.token }
			);

			if (result.data.success !== true) {
				console.log(result);
				dispatch({
					type: "SET_ERROR",
					payload: {
						error: true,
						errorMessage: "Can't update campaign data",
					},
				});
				return;
			}

			dispatch({
				type: "UPDATE_CAMPAIGN_DATA",
				payload: {
					key,
					value,
				},
			});
			return;
		} catch (error) {
			if (axios.isCancel(error)) {
				return;
			}

			console.log(error);
			dispatch({
				type: "SET_ERROR",
				payload: {
					error: true,
					errorMessage: "Can't update campaign data",
				},
			});
			return;
		}
	};

	/**
	 * ==============================
	 * ======= SCREEN ACTIONS =======
	 * ==============================
	 */

	/**
	 * Add new screen
	 * @param {string} screenType The type of the screen we'd like to add
	 * @param {string} screenId New screen's unique id
	 */
	const addScreen = async (screenType, screenId) => {
		const successScreenId = state.screens[state.screens.length - 2]._id;
		const failureScreenId = state.screens[state.screens.length - 1]._id;

		const newScreen = {
			screenId,
			type: screenType,
			orderIndex: state.screens.length - 2,
			background: "#ffffff",
			campaignId: state.campaign._id,
			screenItems: [],
		};
		// add screen to state
		dispatch({
			type: "ADD_SCREEN",
			payload: newScreen,
		});

		// save screen to the database
		let source = axios.CancelToken.source();
		try {
			const result = await axios.post(
				`${process.env.APP_URL}/api/editor/screen/add`,
				{
					campaignId: state.campaign._id,
					screen: newScreen,
					successScreenId, // sending along to update order index
					failureScreenId, // sending along to update order index
				},
				{
					headers: {
						"Content-Type": "application/json",
					},
				},
				{ cancelToken: source.token }
			);

			if (result.data.success !== true) {
				console.log(result);
				// set error
				dispatch({
					type: "SET_ERROR",
					payload: {
						error: true,
						errorMessage: "Can't add new screen",
					},
				});

				// remove screen from state
				dispatch({
					type: "REMOVE_SCREEN",
					payload: screenId,
				});

				return;
			}

			// update screen in state with database id
			dispatch({
				type: "UPDATE_SCREEN",
				payload: {
					screenId,
					data: {
						_id: result.data.screen._id,
					},
				},
			});

			// scroll to newly added screen
			setTimeout(() => {
				document.getElementById(`screen-${screenType}-${screenId}`).scrollIntoView();
			}, 100);

			return;
		} catch (error) {
			if (axios.isCancel(error)) {
				return;
			}

			console.log(error);
			// set error
			dispatch({
				type: "SET_ERROR",
				payload: {
					error: true,
					errorMessage: "Can't add new screen",
				},
			});

			// remove screen from state
			dispatch({
				type: "REMOVE_SCREEN",
				payload: screenId,
			});
			return;
		}
	};

	/**
	 * Set active screen in global state
	 * @param {obj} activeScreen active screen object
	 */
	const setActiveScreen = (activeScreen) => {
		dispatch({
			type: "SET_ACTIVE_SCREEN",
			payload: activeScreen,
		});
	};

	/**
	 * Helper function to reset active screen in global state
	 */
	const resetActiveScreen = () => {
		setActiveScreen("");
	};

	/**
	 * ==============================
	 * ======== ITEM ACTIONS ========
	 * ==============================
	 */

	/**
	 * Add new item to a screen
	 * @param {int} screenIndex the index of the screen the item was dropped
	 * @param {obj} newScreenItem new screen item object
	 */
	const addScreenItem = async (screenIndex, newScreenItem, screenDbId) => {
		// add screen item to global state
		dispatch({
			type: "ADD_SCREEN_ITEM",
			payload: {
				screenIndex,
				newScreenItem,
			},
		});

		// save screen item to the database
		let source = axios.CancelToken.source();
		try {
			const result = await axios.post(
				`${process.env.APP_URL}/api/editor/screen-item/add`,
				{
					campaignId: state.campaign._id,
					screenId: screenDbId,
					screenItem: newScreenItem,
				},
				{
					headers: {
						"Content-Type": "application/json",
					},
				},
				{ cancelToken: source.token }
			);

			if (result.data.success !== true) {
				console.log(result);
				// set error
				dispatch({
					type: "SET_ERROR",
					payload: {
						error: true,
						errorMessage: "Can't add new screen item",
					},
				});

				// remove screen from state
				dispatch({
					type: "REMOVE_SCREEN_ITEM",
					payload: {
						screenId: newScreenItem.screenId,
						itemId: newScreenItem.itemId,
					},
				});

				return;
			}

			dispatch({
				type: "UPDATE_SCREEN_ITEM",
				payload: {
					screenId: newScreenItem.screenId,
					itemId: newScreenItem.itemId,
					data: {
						_id: result.data.screenItem._id,
					},
				},
			});
			return;
		} catch (error) {
			if (axios.isCancel(error)) {
				return;
			}

			console.log(error);
			// set error
			dispatch({
				type: "SET_ERROR",
				payload: {
					error: true,
					errorMessage: "Can't add new screen item",
				},
			});

			// remove screen from state
			dispatch({
				type: "REMOVE_SCREEN_ITEM",
				payload: {
					screenId: newScreenItem.screenId,
					itemId: newScreenItem.itemId,
				},
			});
			return;
		}
	};

	/**
	 * Set active screen item in global stat
	 * @param {obj} activeScreenItem active screen item object
	 */
	const setActiveScreenItem = (activeScreenItem) => {
		dispatch({
			type: "SET_ACTIVE_SCREEN_ITEM",
			payload: activeScreenItem,
		});
	};

	/**
	 * Helper function to reset active screen item
	 */
	const resetActiveScreenItem = () => {
		setActiveScreenItem("");
	};

	/**
	 * Update screen item data
	 * @param {int} screenIndex The index of the screen where the screen item is
	 * @param {int} screenItemIndex The index of the screen item to update
	 * @param {string} screenItemId The db id of the item
	 * @param {obj} screenItemData The data to update the screen item to
	 */
	const updateScreenItem = async (screenIndex, screenItemIndex, screenItemDbId, screenItemUpdatedData) => {
		// update screen item data in local state
		dispatch({
			type: "UPDATE_SCREEN_ITEM",
			payload: {
				screenIndex,
				screenItemIndex,
				data: {
					...screenItemUpdatedData,
				},
			},
		});

		// update screen item data in the db
		let source = axios.CancelToken.source();
		try {
			const result = await axios.post(
				`${process.env.APP_URL}/api/editor/screen-item/update`,
				{
					campaignId: state.campaign._id,
					screenItemId: screenItemDbId,
					screenItemUpdatedData,
				},
				{
					headers: {
						"Content-Type": "application/json",
					},
				},
				{ cancelToken: source.token }
			);

			if (result.data.success !== true) {
				console.log(result);
				// set error
				dispatch({
					type: "SET_ERROR",
					payload: {
						error: true,
						errorMessage: "Can't save changes. Please wait a minute and try again",
					},
				});
				return;
			}
		} catch (error) {
			if (axios.isCancel(error)) {
				return;
			}

			console.log(error);
			// set error
			dispatch({
				type: "SET_ERROR",
				payload: {
					error: true,
					errorMessage: "Can't save changes. Please wait a minute and try again",
				},
			});
			return;
		}
	};

	return (
		<GlobalContext.Provider
			value={{
				loading: state.loading,
				error: state.error,
				errorMessage: state.errorMessage,
				criticalError: state.criticalError,
				criticalErrorMessage: state.criticalErrorMessage,
				activeScreen: state.activeScreen,
				activeScreenItem: state.activeScreenItem,
				campaign: state.campaign,
				screens: state.screens,

				setError,
				loadCampaignData,
				updateCampaignData,
				addScreen,
				setActiveScreen,
				resetActiveScreen,
				addScreenItem,
				setActiveScreenItem,
				resetActiveScreenItem,
				updateScreenItem,
			}}
		>
			{children}
		</GlobalContext.Provider>
	);
};
