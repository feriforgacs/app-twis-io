export default function UpdateState(state, action) {
	return {
		...state,
		[action.payload.key]: action.payload.value,
	};
}
