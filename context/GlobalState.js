import { createContext, useReducer } from "react";
import axios from "axios";
import AppReducer from "./AppReducer";

let InitialState = {
	loading: true,
	saving: false,
	systemMessage: "",
	error: false,
	errorMessage: "😢  An error occured. Please, refresh the page and try again.",
};

export const GlobalContext = createContext(InitialState);

export const GlobalProvider = ({ children }) => {
	const [state, dispatch] = useReducer(AppReducer, InitialState);

	// Actions
	const loadCampaignData = async (campaignId) => {
		let source = axios.CancelToken.source();

		try {
			const result = await axios(`${process.env.APP_URL}/api/editor/campaign/data?id=${campaignId}`, { cancelToken: source.token });

			if (result.data.success !== true) {
				/**
				 * @todo set error in global state
				 */
				console.log(result);
				return { error: true, errorMessage: "Can't get campaign data from the database" };
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

			/**
			 * @todo set error in global state
			 */
			console.log(error);
			return { error: true, errorMessage: "Can't get campaign data from the database" };
		}
	};

	return (
		<GlobalContext.Provider
			value={{
				error: state.error,
				errorMessage: state.errorMessage,

				loadCampaignData,
			}}
		>
			{children}
		</GlobalContext.Provider>
	);
};
