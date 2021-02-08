import { useContext } from "react";
import { GlobalContext } from "../../../context/GlobalState";
import styles from "./ScreenSettings.module.scss";
import Background from "./screen-settings/Background";

export default function ScreenSettings() {
	const { unsetActiveScreen, unsetActiveScreenItem } = useContext(GlobalContext);
	return (
		<div className={styles.settings}>
			<div className={styles.settingsHeader}>
				Screen Settings
				<button
					className={styles.settingsClose}
					onClick={() => {
						unsetActiveScreen();
						unsetActiveScreenItem();
					}}
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
						<line x1="18" y1="6" x2="6" y2="18"></line>
						<line x1="6" y1="6" x2="18" y2="18"></line>
					</svg>
				</button>
			</div>
			<Background />
		</div>
	);
}
