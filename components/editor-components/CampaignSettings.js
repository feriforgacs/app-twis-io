import { useEffect, useRef } from "react";
import styles from "./CampaignSettings.module.scss";
import SuccessLimit from "./campaign-settings-components/SuccessLimit";
import OpenGraph from "./campaign-settings-components/OpenGraph";

export default function CampaignSettings({ hideCampaignSettings }) {
	const campaignSettingsRef = useRef();

	const handleClickOutside = (e) => {
		if (campaignSettingsRef.current && !campaignSettingsRef.current.contains(e.target)) {
			hideCampaignSettings();
		}
	};

	useEffect(() => {
		document.addEventListener("click", handleClickOutside);
		return () => {
			document.removeEventListener("click", handleClickOutside);
		};
	});

	return (
		<div className={styles.campaignSettingsPanel} ref={campaignSettingsRef}>
			<div className={`${styles.settingsHeader} item-settings`}>
				Campaign Settings
				<button
					className={`${styles.settingsClose}`}
					onClick={() => {
						hideCampaignSettings();
					}}
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
						<line x1="18" y1="6" x2="6" y2="18"></line>
						<line x1="6" y1="6" x2="18" y2="18"></line>
					</svg>
				</button>
			</div>
			<SuccessLimit />
			<OpenGraph />
		</div>
	);
}
