import { useContext, useState } from "react";
import { DebounceInput } from "react-debounce-input";
import styles from "../ScreenSettings.module.scss";
import { GlobalContext } from "../../../../context/GlobalState";

export default function FormSettings() {
	const { activeScreen, activeScreenItem, setActiveScreenItem, updateScreenItem } = useContext(GlobalContext);

	const [collectName, setCollectName] = useState(activeScreenItem.settings.collectName || false);
	const [collectEmail, setCollectEmail] = useState(activeScreenItem.settings.collectEmail || false);

	return (
		<>
			<div className={`${styles.settingsSection} item-settings`}>
				<label className={`${styles.settingsLabel} item-settings`}>Data Collection Settings</label>
				<span className={styles.helpText}>With the help of these options you can update some of the settings of the data collection form.</span>
				<div className={styles.buttonActionOptions}>
					<label className={`${collectName ? styles.optionSelected : ""}`}>
						<input
							type="checkbox"
							defaultChecked={collectName}
							onChange={() => {
								setCollectName(!collectName);
								updateScreenItem(activeScreen.screenId, activeScreenItem.itemId, { settings: { ...activeScreenItem.settings, collectName: !collectName } });
								setActiveScreenItem({ ...activeScreenItem, settings: { ...activeScreenItem.settings, collectName: !collectName } });
							}}
						/>{" "}
						Collect Name
					</label>

					<label className={`${collectEmail ? styles.optionSelected : ""}`}>
						<input
							type="checkbox"
							defaultChecked={collectEmail}
							onChange={() => {
								setCollectEmail(!collectEmail);
								updateScreenItem(activeScreen.screenId, activeScreenItem.itemId, { settings: { ...activeScreenItem.settings, collectEmail: !collectEmail } });
								setActiveScreenItem({ ...activeScreenItem, settings: { ...activeScreenItem.settings, collectEmail: !collectEmail } });
							}}
						/>{" "}
						Collect Email Address
					</label>
				</div>
			</div>
			<div className={`${styles.settingsSection} item-settings`}>
				<label className={`${styles.settingsLabel} item-settings`}>Terms and Conditions URL</label>
				<span className={styles.helpText}>To make sure that you can use the collected information for marketing purposes, please, use the proper URL for your terms and conditions.</span>

				<DebounceInput
					className={styles.legalURLInput}
					minLength="3"
					placeholder="https://"
					debounceTimeout="1000"
					value={activeScreenItem.settings.legalURL || ""}
					onChange={(e) => {
						const legalURL = e.target.value;
						updateScreenItem(activeScreen.screenId, activeScreenItem.itemId, { settings: { ...activeScreenItem.settings, legalURL } });
						setActiveScreenItem({ ...activeScreenItem, settings: { ...activeScreenItem.settings, legalURL } });
					}}
				/>
			</div>
		</>
	);
}
