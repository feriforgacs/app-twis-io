import styles from "./ScreenSettings.module.scss";

export default function ScreenSettings({ visible }) {
	return (
		<div className={`${styles.settings} ${visible ? "" : "hidden"}`}>
			<div className={styles.settingsHeader}>
				Screen Settings
				<button className={styles.settingsClose}>
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
						<line x1="18" y1="6" x2="6" y2="18"></line>
						<line x1="6" y1="6" x2="18" y2="18"></line>
					</svg>
				</button>
			</div>
		</div>
	);
}
