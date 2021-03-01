import styles from "../ScreenSettings.module.scss";

export default function ScreenInfo({ screenType }) {
	const infoText = {
		endSuccess: "This is the screen participants will see once they successfully completed the quiz",
		endFailure: "Participants, who were not able to provide enough correct answers will see this screen",
		sharePanel: "You can update the share settings of your campaign (title, description and image) under the Campaign settings",
	};
	return (
		<>
			{infoText[screenType] && (
				<div className={`${styles.settingsSection} item-settings`}>
					<p className={styles.itemInfo}>
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5a38fc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
							<circle cx="12" cy="12" r="10"></circle>
							<line x1="12" y1="16" x2="12" y2="12"></line>
							<line x1="12" y1="8" x2="12.01" y2="8"></line>
						</svg>
						<span>{infoText[screenType]}</span>
					</p>
				</div>
			)}
		</>
	);
}
