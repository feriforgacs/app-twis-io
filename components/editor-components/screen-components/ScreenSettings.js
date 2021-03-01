import { useContext } from "react";
import { GlobalContext } from "../../../context/GlobalState";
import styles from "./ScreenSettings.module.scss";
import Background from "./screen-settings/Background";
import SuccessLimit from "../campaign-settings-components/SuccessLimit";
import ScreenInfo from "./screen-settings/ScreenInfo";

export default function ScreenSettings() {
	const { activeScreen, unsetActiveScreen, unsetActiveScreenItem } = useContext(GlobalContext);
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
			<ScreenInfo screenType={activeScreen.type} />
			{activeScreen && (activeScreen.type === "endSuccess" || activeScreen.type === "endFailure") && <SuccessLimit />}
			<Background />
		</div>
	);
}
