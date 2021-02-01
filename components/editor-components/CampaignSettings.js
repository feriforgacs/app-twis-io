import { useContext, useState } from "react";
import { GlobalContext } from "../../context/GlobalState";
import Switch from "react-switch";
import styles from "./CampaignSettings.module.scss";

export default function CampaignSettings() {
	const { campaign, updateCampaignData } = useContext(GlobalContext);
	const [active, setActive] = useState(campaign.status === "active" || false);
	return (
		<div className={styles.campaignSettingsPanel}>
			<div className={styles.settingsPanelSection}>
				<label className={styles.settingsPanelLabel}>
					<Switch
						onChange={() => {
							setActive(!active);
							updateCampaignData("status", campaign.status === "active" ? "draft" : "active");
						}}
						checked={active}
						offColor="#34495b"
						onColor="#159c5b"
					/>
					<span>Campaign Active</span>
				</label>
				<p className={styles.settingsPanelHelp}>
					Your campaign is <strong>{campaign.status === "active" ? "active" : "inactive"}</strong>. You can change the status by clicking on the toggle above.
				</p>
			</div>
		</div>
	);
}
