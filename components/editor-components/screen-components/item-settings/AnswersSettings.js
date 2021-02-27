import { useContext, useState, useEffect } from "react";
import { DebounceInput } from "react-debounce-input";
import styles from "../ScreenSettings.module.scss";
import { GlobalContext } from "../../../../context/GlobalState";

export default function AnswersSettings() {
	const { confettiPreview, activeScreen, activeScreenItem, setActiveScreenItem, updateScreenItem, updateState } = useContext(GlobalContext);

	const [successEmoji, setSuccessEmoji] = useState(activeScreenItem.settings.successEmoji || "🎉");
	const [confettiPreviewActive, setConfettiPreviewActive] = useState(confettiPreview);

	useEffect(() => {
		setConfettiPreviewActive(confettiPreview);
	}, [confettiPreview]);

	return (
		<>
			<div className={`${styles.settingsSection} screen-settings`}>
				<label className={`${styles.settingsLabel} screen-settings`}>Success Emoji Confetti</label>
				<span className={styles.helpText}>The emoji that &quot;explodes&quot; when selecting the correct option. </span>
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
				<button
					className={styles.previewButton}
					onClick={() => {
						// scroll screen item to view
						const answerScreenItem = document.getElementById(`answers-${activeScreenItem.itemId}`);
						if (answerScreenItem) {
							answerScreenItem.scrollIntoView({ behavior: "smooth" });
						}
						updateState("confettiPreview", !confettiPreviewActive);
					}}
				>
					{confettiPreviewActive ? (
						<>
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
							</svg>
							<span>Close preview</span>
						</>
					) : (
						<>
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
							</svg>
							<span>Preview success confetti</span>
						</>
					)}
				</button>
			</div>
		</>
	);
}
