import { useContext, useState } from "react";
import { DebounceInput } from "react-debounce-input";
import styles from "../ScreenSettings.module.scss";
import { GlobalContext } from "../../../../context/GlobalState";

export default function ButtonAction() {
	const { activeScreen, activeScreenItem, setActiveScreenItem, updateScreenItem } = useContext(GlobalContext);

	const actionOptions = [
		{ action: "nextscreen", label: "Go to next screen" },
		{ action: "previousscreen", label: "Go to previous screen" },
		{ action: "restart", label: "Go to first screen (restart)" },
		{ action: "url", label: "Go to URL" },
	];

	const [action, setAction] = useState(activeScreenItem.settings.action || "nextscreen");
	const [actionURL, setActionURL] = useState(activeScreenItem.settings.actionURL || "");

	return (
		<div className={`${styles.settingsSection} screen-settings`}>
			<label className={`${styles.settingsLabel} screen-settings`}>Button Action Settings</label>
			<span className={styles.helpText}>By changing the settings below you can control what would happen when someone taps the button.</span>

			<div className={styles.buttonActionOptions}>
				{actionOptions.map((actionOption, index) => (
					<label key={index} className={`${action === actionOption.action ? styles.optionSelected : ""}`}>
						<input
							name="button-action"
							value={actionOption.action}
							checked={action === actionOption.action}
							type="radio"
							onChange={(e) => {
								const action = e.target.value;
								setAction(action);
								updateScreenItem(activeScreen.screenId, activeScreenItem.itemId, { settings: { ...activeScreenItem.settings, action } });
								setActiveScreenItem({ ...activeScreenItem, settings: { ...activeScreenItem.settings, action } });
							}}
						/>
						{actionOption.label}
					</label>
				))}
				{action === "url" && (
					<DebounceInput
						type="url"
						className={styles.actionURLInput}
						value={actionURL}
						placeholder="https://..."
						debounceTimeout="300"
						onChange={(e) => {
							const actionURL = e.target.value;
							setActionURL(actionURL);
							updateScreenItem(activeScreen.screenId, activeScreenItem.itemId, { settings: { ...activeScreenItem.settings, actionURL } });
							setActiveScreenItem({ ...activeScreenItem, settings: { ...activeScreenItem.settings, actionURL } });
						}}
					/>
				)}
			</div>
		</div>
	);
}
