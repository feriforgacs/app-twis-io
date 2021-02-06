import styles from "./ScreenSettings.module.scss";
import Opacity from "./item-settings/Opacity";

export default function ItemSettings() {
	return (
		<div className={`${styles.settings} item-settings`}>
			<div className={`${styles.settingsHeader} item-settings`}>
				Item Settings
				<button className={`${styles.settingsClose}`}>
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
						<line x1="18" y1="6" x2="6" y2="18"></line>
						<line x1="6" y1="6" x2="18" y2="18"></line>
					</svg>
				</button>
			</div>
			<Opacity />
		</div>
	);
}
