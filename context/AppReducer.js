import SetCriticalError from "./global-reducers/SetCriticalError";
import SetError from "./global-reducers/SetError";
import SetMoveableDisabled from "./global-reducers/SetMoveableDisabled";

import SetCampaignInitialState from "./campaign-reducers/SetCampaignInitialState";
import UpdateCampaignData from "./campaign-reducers/UpdateCampaignData";
import UpdateCampaignFonts from "./campaign-reducers/UpdateCampaignFonts";

import AddScreen from "./screen-reducers/AddScreen";
import UpdateScreen from "./screen-reducers/UpdateScreen";
import RemoveScreen from "./screen-reducers/RemoveScreen";
import DuplicateScreen from "./screen-reducers/DuplicateScreen";
import SetActiveScreen from "./screen-reducers/SetActiveScreen";
import UpdateScreenOrder from "./screen-reducers/UpdateScreenOrder";

import AddScreenItem from "./item-reducers/AddScreenItem";
import UpdateScreenItem from "./item-reducers/UpdateScreenItem";
import UpdateScreenItemOrder from "./item-reducers/UpdateScreenItemOrder";
import RemoveScreenItem from "./item-reducers/RemoveScreenItem";
import SetActiveScreenItem from "./item-reducers/SetActiveScreenItem";

export default function AppReducer(state, action) {
	switch (action.type) {
		/**
		 * Set critical error state
		 */
		case "SET_CRITICAL_ERROR":
			return SetCriticalError(state, action);

		/**
		 * Set error state
		 */
		case "SET_ERROR":
			return SetError(state, action);

		/**
		 * Enable or disable moveable
		 */
		case "SET_MOVEABLE_DISABLED":
			return SetMoveableDisabled(state, action);

		/**
		 * Set campaign initial state (when editor loads)
		 */
		case "SET_CAMPAIGN_INITIAL_STATE":
			return SetCampaignInitialState(state, action);

		/**
		 * Update campaign data
		 */
		case "UPDATE_CAMPAIGN_DATA":
			return UpdateCampaignData(state, action);

		/**
		 * Update campaign fonts
		 */
		case "UPDATE_CAMPAIGN_FONTS":
			return UpdateCampaignFonts(state, action);

		/**
		 * ==============================
		 * ======= SCREEN ACTIONS =======
		 * ==============================
		 */
		/**
		 * Add new screen
		 */
		case "ADD_SCREEN":
			return AddScreen(state, action);

		/**
		 * Update screen item
		 */
		case "UPDATE_SCREEN":
			return UpdateScreen(state, action);

		/**
		 * Remove screen
		 */
		case "REMOVE_SCREEN":
			return RemoveScreen(state, action);

		/**
		 * Duplicate screen
		 */
		case "DUPLICATE_SCREEN":
			return DuplicateScreen(state, action);

		/**
		 * Set active screen
		 */
		case "SET_ACTIVE_SCREEN":
			return SetActiveScreen(state, action);

		/**
		 * Change the order of a screen
		 */
		case "UPDATE_SCREEN_ORDER":
			return UpdateScreenOrder(state, action);

		/**
		 * ==============================
		 * ======== ITEM ACTIONS ========
		 * ==============================
		 */

		/**
		 * Add new item to screen
		 */
		case "ADD_SCREEN_ITEM":
			return AddScreenItem(state, action);

		/**
		 * Update screen item data
		 */
		case "UPDATE_SCREEN_ITEM":
			return UpdateScreenItem(state, action);

		/**
		 * Update item order on screen
		 */
		case "UPDATE_SCREEN_ITEM_ORDER":
			return UpdateScreenItemOrder(state, action);

		/**
		 * Remove screen item
		 */
		case "REMOVE_SCREEN_ITEM":
			return RemoveScreenItem(state, action);

		/**
		 * Set active screen item
		 */
		case "SET_ACTIVE_SCREEN_ITEM":
			return SetActiveScreenItem(state, action);

		default:
			return state;
	}
}
