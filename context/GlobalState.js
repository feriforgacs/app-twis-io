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
	moveableDisabled: false,
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

	const setMoveableDisabled = (disabled) => {
		dispatch({
			type: "SET_MOVEABLE_DISABLED",
			payload: disabled,
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
						errorMessage: "Can't get campaign data from the database. Please, refresh the page to try again.",
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
					errorMessage: "Can't get campaign data from the database. Please, refresh the page to try again.",
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
	 * Update campaign data only in state, not in db
	 * This is a helper function to avoid double api requests
	 * @param {string} key The key of the field to update
	 * @param {string} value The value of the field to update to
	 */
	const updateCampaignDataInState = (key, value) => {
		dispatch({
			type: "UPDATE_CAMPAIGN_DATA",
			payload: {
				key,
				value,
			},
		});
		return;
	};

	/**
	 * Update font families used by the campaign
	 * @param {strong} fontFamily Selected font family
	 */
	const updateCampaignFonts = async (fontFamily) => {
		if (!state.campaign.fonts || !state.campaign.fonts.includes(fontFamily)) {
			// update campaign fonts in state
			dispatch({
				type: "UPDATE_CAMPAIGN_FONTS",
				payload: fontFamily,
			});
		}

		/**
		 * Check all used fonts
		 */
		let campaignFonts = [];
		const itemsWithFontFamily = ["text", "button", "question", "answer", "form"];
		state.screens.forEach((screen) => {
			if (screen.screenItems.length > 0) {
				screen.screenItems.forEach((screenItem) => {
					if (itemsWithFontFamily.includes(screenItem.type) && !campaignFonts.includes(screenItem.settings.fontFamily)) {
						campaignFonts.push(screenItem.settings.fontFamily);
					}
				});
			}
		});

		const currentCampaignFonts = [...state.campaign.fonts].sort();
		campaignFonts.sort();

		if (currentCampaignFonts !== campaignFonts) {
			updateCampaignData("fonts", campaignFonts);
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
	 * @param {string} screenId New screen's uuid
	 */
	const addScreen = async (screenType, screenId) => {
		const newScreen = {
			screenId,
			type: screenType,
			orderIndex: state.screens.length - 2,
			background: {
				type: "solid",
				color: "#ffffff",
			},
			campaignId: state.campaign._id,
			screenItems: [],
		};
		// add screen to state
		dispatch({
			type: "ADD_SCREEN",
			payload: newScreen,
		});

		setActiveScreen(newScreen);
		unsetActiveScreenItem();

		// save screen to the database
		let source = axios.CancelToken.source();
		try {
			const result = await axios.post(
				`${process.env.APP_URL}/api/editor/screen/add`,
				{
					campaignId: state.campaign._id,
					screen: newScreen,
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
					payload: { screenId },
				});

				return;
			}

			// scroll to newly added screen
			setTimeout(() => {
				const addedScreen = document.getElementById(`screen-${screenType}-${screenId}`);
				if (addedScreen) {
					addedScreen.scrollIntoView({ behavior: "smooth" });
					setActiveScreen({
						...newScreen,
						_id: result.data.screen._id,
					});
				}
			}, 100);

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
				payload: { screenId },
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
	const unsetActiveScreen = () => {
		setActiveScreen("");
	};

	/**
	 * Remove screen
	 * @param {string} screenId UUID of the screen to be removed
	 */
	const removeScreen = async (screenId) => {
		// remove screen from state
		dispatch({
			type: "REMOVE_SCREEN",
			payload: { screenId },
		});

		// remove screen from the database
		let source = axios.CancelToken.source();
		try {
			const result = await axios.delete(
				`${process.env.APP_URL}/api/editor/screen/delete`,
				{
					data: {
						campaignId: state.campaign._id,
						screenId, // this is not the DB id, it is the generated uuid
					},
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
						errorMessage: "Can't remove screen. Reload the page and try again",
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
					errorMessage: "Can't remove screen. Reload the page and try again",
				},
			});
			return;
		}
	};

	/**
	 * Remove screen
	 * @param {string} screenId UUID of the screen to be duplicated
	 * @param {obj} newScreenData new screen data with all information and screen items
	 */
	const duplicateScreen = async (screenId, newScreenData) => {
		// update local state
		dispatch({
			type: "DUPLICATE_SCREEN",
			payload: {
				screenId,
				newScreenData,
			},
		});

		/**
		 * save new screen to the database
		 */
		// save screen to the database
		let source = axios.CancelToken.source();
		try {
			const result = await axios.post(
				`${process.env.APP_URL}/api/editor/screen/duplicate`,
				{
					campaignId: state.campaign._id,
					screen: newScreenData,
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
						errorMessage: "Can't duplicate screen",
					},
				});

				// remove screen from state
				dispatch({
					type: "REMOVE_SCREEN",
					payload: { screenId: newScreenData.screenId },
				});

				return;
			}

			// scroll to duplicated screen
			setTimeout(() => {
				const duplicatedScreen = document.getElementById(`screen-${newScreenData.type}-${newScreenData.screenId}`);
				if (duplicatedScreen) {
					duplicatedScreen.scrollIntoView({ behavior: "smooth" });
					setActiveScreen(newScreenData);
				}
			}, 100);

			// update screen in state with database id
			dispatch({
				type: "UPDATE_SCREEN",
				payload: {
					screenId: newScreenData.screenId,
					data: {
						_id: result.data.screen._id,
					},
				},
			});

			/**
			 * @todo - update screen items db id in state - Not sure if this is necessary
			 */

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
					errorMessage: "Can't duplicate screen",
				},
			});

			// remove screen from state
			dispatch({
				type: "REMOVE_SCREEN",
				payload: { screenId: newScreenData.screenId },
			});
			return;
		}
	};

	/**
	 * Update screen data in state and in the db
	 * @param {string} screenId UUID of the screen to be updated
	 * @param {obj} screenUpdateData screen data to be updated
	 */
	const updateScreen = async (screenId, screenUpdateData) => {
		dispatch({
			type: "UPDATE_SCREEN",
			payload: {
				screenId,
				data: {
					...screenUpdateData,
				},
			},
		});

		// update screen data in the db
		let source = axios.CancelToken.source();
		try {
			const result = await axios.post(
				`${process.env.APP_URL}/api/editor/screen/update`,
				{
					campaignId: state.campaign._id,
					screenId: screenId,
					screenData: screenUpdateData,
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
						errorMessage: "Can't save screen settings",
					},
				});

				return;
			}

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
					errorMessage: "Can't save screen settings",
				},
			});
			return;
		}
	};

	/**
	 * Update screen data only in state
	 * @param {string} screenId UUID of the screen to be updated
	 * @param {obj} screenUpdateData screen data to be updated
	 */
	const updateScreenInState = async (screenId, screenUpdateData) => {
		dispatch({
			type: "UPDATE_SCREEN",
			payload: {
				screenId,
				data: {
					...screenUpdateData,
				},
			},
		});
	};

	/**
	 * Move screen forward or backward
	 * @param {string} screenId UUID of the selected screen
	 * @param {string} direction direction of the order
	 */
	const updateScreenOrder = async (screenId, direction) => {
		dispatch({
			type: "UPDATE_SCREEN_ORDER",
			payload: {
				screenId,
				direction,
			},
		});

		/**
		 * @todo update order in the db
		 */
	};

	/**
	 * ==============================
	 * ======== ITEM ACTIONS ========
	 * ==============================
	 */

	/**
	 * Add new item to a screen
	 * @param {obj} newScreenItem new screen item object
	 * @param {string} screenDbId db id of the screen where the item should be added
	 */
	const addScreenItem = async (newScreenItem, screenDbId) => {
		// add screen item to global state
		dispatch({
			type: "ADD_SCREEN_ITEM",
			payload: {
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
	const unsetActiveScreenItem = () => {
		setActiveScreenItem("");
	};

	/**
	 * Update screen item data in state and in db
	 * @param {string} screenId The generated uuid of the screen
	 * @param {string} itemId The generated uuid of the screen item
	 * @param {obj} screenItemUpdatedData The updated data of the screen item
	 */
	const updateScreenItem = async (screenId, itemId, screenItemUpdatedData) => {
		// update screen item data in local state
		dispatch({
			type: "UPDATE_SCREEN_ITEM",
			payload: {
				screenId,
				itemId,
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
					itemId: itemId, // this is not the DB id, it is the generated uuid
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

	/**
	 * Update screen item data only in state, without saving to the db
	 * @param {string} screenId The uuid of the screen where the item is
	 * @param {string} itemId The uuid of the updated item
	 * @param {obj} screenItemData The data to update the screen item to
	 */
	const updateScreenItemInState = async (screenId, itemId, screenItemUpdatedData) => {
		// update screen item data in local state
		dispatch({
			type: "UPDATE_SCREEN_ITEM",
			payload: {
				screenId,
				itemId,
				data: {
					...screenItemUpdatedData,
				},
			},
		});
	};

	/**
	 * Update the order of an item on a screen
	 * @param {string} screenId The uuid of the screen where the item is
	 * @param {string} itemId The uuid of the item
	 * @param {string} direction The direction of the order change (forward, backward, front, back)
	 */
	const updateItemOrder = async (screenId, itemId, direction) => {
		dispatch({
			type: "UPDATE_SCREEN_ITEM_ORDER",
			payload: {
				screenId,
				itemId,
				direction,
			},
		});

		// update item order in the db
		let source = axios.CancelToken.source();
		try {
			const result = await axios.post(
				`${process.env.APP_URL}/api/editor/screen-item/position`,
				{
					campaignId: state.campaign._id,
					itemId: itemId, // this is not the DB id, it is the generated uuid
					direction,
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
						errorMessage: "Can't save changes. Please reload the page and try again",
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
					errorMessage: "Can't save changes. Please reload the page and try again",
				},
			});
			return;
		}
	};

	/**
	 * Remove screen item
	 * @param {string} screenId The generated uuid  of the screen where the screen item is
	 * @param {string} itemId The generated uuid of the screen item
	 */
	const removeScreenItem = async (screenId, itemId) => {
		// remove screen item from state
		dispatch({
			type: "REMOVE_SCREEN_ITEM",
			payload: {
				screenId,
				itemId,
			},
		});

		// remove screen item from the database
		let source = axios.CancelToken.source();
		try {
			const result = await axios.delete(
				`${process.env.APP_URL}/api/editor/screen-item/delete`,
				{
					data: {
						campaignId: state.campaign._id,
						itemId, // this is not the DB id, it is the generated uuid
					},
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
						errorMessage: "Can't remove item. Reload the page and try again",
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
					errorMessage: "Can't remove item. Reload the page and try again",
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
				moveableDisabled: state.moveableDisabled,
				campaign: state.campaign,
				screens: state.screens,

				setError,
				loadCampaignData,
				updateCampaignData,
				updateCampaignDataInState,
				updateCampaignFonts,
				setMoveableDisabled,

				// screen actions
				addScreen,
				setActiveScreen,
				unsetActiveScreen,
				removeScreen,
				duplicateScreen,
				updateScreen,
				updateScreenInState,
				updateScreenOrder,

				// screen item actions
				addScreenItem,
				setActiveScreenItem,
				unsetActiveScreenItem,
				updateScreenItem,
				updateScreenItemInState,
				updateItemOrder,
				removeScreenItem,
			}}
		>
			{children}
		</GlobalContext.Provider>
	);
};
