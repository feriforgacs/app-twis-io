export default function UpdateScreenOrder(state, action) {
	let screenIndex = state.screens.findIndex((obj) => obj.screenId === action.payload.screenId);
	let screens = [...state.screens];

	if (screenIndex > 1 && action.payload.direction === "up") {
		// move the screen backward in the screens array
		// the first screen is always the start screen (with index 0) so the index of a screen can't be 0
		let previousScreen = screens[screenIndex - 1];
		let currentScreen = screens[screenIndex];

		// switch the current screen with the previous screen, and update order index
		screens[screenIndex - 1] = { ...currentScreen, orderIndex: currentScreen.orderIndex - 1 };
		screens[screenIndex] = { ...previousScreen, orderIndex: previousScreen.orderIndex + 1 };
	} else if (screenIndex < screens.length - 3 && action.payload.direction === "down") {
		// move the screen forward in the screens array
		// -3 because the two last screens are always the success and failure screens
		// so if there are 5 screens, the highest allowed position for the screen is 2, 3 will be the success screen, and 4 will be the failure screen
		let nextScreen = screens[screenIndex + 1];
		let currentScreen = screens[screenIndex];

		// switch the current screen with the next screen, and update order index
		screens[screenIndex + 1] = { ...currentScreen, orderIndex: currentScreen.orderIndex + 1 };
		screens[screenIndex] = { ...nextScreen, orderIndex: nextScreen.orderIndex - 1 };
	}

	return {
		...state,
		screens,
	};
}
