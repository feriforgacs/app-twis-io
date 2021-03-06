export default function FrontendReducer(state, action) {
	switch (action.type) {
		case "UPDATE_STATE":
			return {
				...state,
				[action.payload.key]: action.payload.value,
			};

		default:
			return state;
	}
}
