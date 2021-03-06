import { createContext, useReducer } from "react";
import FrontendReducer from "./FrontendReducer";

let FrontendState = {
	loading: false,
	error: false,
	endScreen: "success",
};

export const FrontendContext = createContext(FrontendState);

export const FrontendProvider = ({ children }) => {
	const [state, dispatch] = useReducer(FrontendReducer, FrontendState);

	return (
		<FrontendContext.Provider
			value={{
				loading: state.loading,
				error: state.error,
				endScreen: state.endScreen,
			}}
		>
			{children}
		</FrontendContext.Provider>
	);
};
