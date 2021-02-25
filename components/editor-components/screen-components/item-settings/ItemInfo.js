import styles from "../ScreenSettings.module.scss";

export default function ItemInfo({ itemType }) {
	const infoText = {
		answers: "Answer options will be displayed in a random order for the visitors",
	};
	return (
		<>
			{infoText[itemType] && (
				<div className={`${styles.settingsSection} item-settings`}>
					<p className={styles.itemInfo}>
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5a38fc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
							<circle cx="12" cy="12" r="10"></circle>
							<line x1="12" y1="16" x2="12" y2="12"></line>
							<line x1="12" y1="8" x2="12.01" y2="8"></line>
						</svg>
						<span>{infoText[itemType]}</span>
					</p>
				</div>
			)}
		</>
	);
}
