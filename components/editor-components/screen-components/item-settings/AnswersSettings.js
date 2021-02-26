import { useContext, useState } from "react";
import { DebounceInput } from "react-debounce-input";
import styles from "../ScreenSettings.module.scss";
import { GlobalContext } from "../../../../context/GlobalState";

export default function AnswersSettings() {
	const { activeScreen, activeScreenItem, setActiveScreenItem, updateScreenItem } = useContext(GlobalContext);

	const [successEmoji, setSuccessEmoji] = useState(activeScreenItem.settings.successEmoji || "🎉");
	const [failureEmoji, setFailureEmoji] = useState(activeScreenItem.settings.failureEmoji || "😢");

	return (
		<>
			<div className={`${styles.settingsSection} screen-settings`}>
				<label className={`${styles.settingsLabel} screen-settings`}>Success Emoji Confetti</label>
				<span className={styles.helpText}>The emoji that explodes when selecting the correct option. </span>
				<DebounceInput
					type="url"
					className={styles.emojiInput}
					value={successEmoji}
					debounceTimeout="300"
					onChange={(e) => {
						const successEmoji = e.target.value;
						setSuccessEmoji(successEmoji);
						updateScreenItem(activeScreen.screenId, activeScreenItem.itemId, { settings: { ...activeScreenItem.settings, successEmoji } });
						setActiveScreenItem({ ...activeScreenItem, settings: { ...activeScreenItem.settings, successEmoji } });
					}}
				/>
			</div>
			<div className={`${styles.settingsSection} screen-settings`}>
				<label className={`${styles.settingsLabel} screen-settings`}>Failure Emoji Confetti</label>
				<span className={styles.helpText}>The emoji that explodes when selecting an incorrect option. </span>
				<DebounceInput
					type="url"
					className={styles.emojiInput}
					value={failureEmoji}
					debounceTimeout="300"
					onChange={(e) => {
						const failureEmoji = e.target.value;
						setFailureEmoji(failureEmoji);
						updateScreenItem(activeScreen.screenId, activeScreenItem.itemId, { settings: { ...activeScreenItem.settings, failureEmoji } });
						setActiveScreenItem({ ...activeScreenItem, settings: { ...activeScreenItem.settings, failureEmoji } });
					}}
				/>
			</div>
		</>
	);
}
