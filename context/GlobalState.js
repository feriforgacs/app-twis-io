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
					[key]: value,
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

	return (
		<GlobalContext.Provider
			value={{
				loading: state.loading,
				error: state.error,
				errorMessage: state.errorMessage,
				criticalError: state.criticalError,
				criticalErrorMessage: state.criticalErrorMessage,
				campaign: state.campaign,
				screens: state.screens,

				setError,
				loadCampaignData,
				updateCampaignData,
			}}
		>
			{children}
		</GlobalContext.Provider>
	);
};
