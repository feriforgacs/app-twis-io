import { useRef, useEffect } from "react";
import Visibility from "./campaign-settings-components/Visibility";
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
			<Visibility />
		</div>
	);
}
