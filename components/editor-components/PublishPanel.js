import { useRef, useEffect } from "react";
import CampaignURL from "./campaign-settings-components/CampaignURL";
import Visibility from "./campaign-settings-components/Visibility";
import ShareOptions from "./campaign-settings-components/ShareOptions";
import Usage from "./campaign-settings-components/Usage";
import styles from "./CampaignSettings.module.scss";

export default function PublishPanel({ hidePublishPanel }) {
	const publishPanelRef = useRef();

	const handleClickOutside = (e) => {
		if (publishPanelRef.current && !publishPanelRef.current.contains(e.target)) {
			hidePublishPanel();
		}
	};

	useEffect(() => {
		document.addEventListener("click", handleClickOutside);
		return () => {
			document.removeEventListener("click", handleClickOutside);
		};
	});

	return (
		<div className={styles.campaignSettingsPanel} ref={publishPanelRef}>
			<div className={`${styles.settingsHeader} item-settings`}>
				Publish and Share Campaign
				<button
					className={`${styles.settingsClose}`}
					onClick={() => {
						hidePublishPanel();
					}}
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
						<line x1="18" y1="6" x2="6" y2="18"></line>
						<line x1="6" y1="6" x2="18" y2="18"></line>
					</svg>
				</button>
			</div>
			<Usage />
			<Visibility />
			<CampaignURL />
			<ShareOptions />
		</div>
	);
}
