import { useEffect, useRef } from "react";
import styles from "./CampaignSettings.module.scss";
import Visibility from "./campaign-settings-components/Visibility";
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
			<Visibility />
			<SuccessLimit />
			<OpenGraph />
		</div>
	);
}
