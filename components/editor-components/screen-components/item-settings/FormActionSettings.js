import { useContext, useState } from "react";
import styles from "../ScreenSettings.module.scss";
import { GlobalContext } from "../../../../context/GlobalState";

export default function FormActionSettings() {
	const { campaign, updateCampaignData } = useContext(GlobalContext);

	const [dataCollectionSuccessAction, setDataCollectionSuccessAction] = useState(campaign.dataCollectionSuccessAction || "popup");

	const formSuccessActionOptions = [
		{
			action: "popup",
			label: "Display a success message",
		},
		{
			action: "redirect",
			label: "Redirect the user to a defined URL",
		},
	];

	return (
		<>
			<div className={`${styles.settingsSection} item-settings`}>
				<label className={`${styles.settingsLabel} item-settings`}>Action after form completion</label>

				<div className={styles.formSuccessActionOptions}>
					{formSuccessActionOptions.map((actionOption, index) => (
						<label key={index} className={`${dataCollectionSuccessAction === actionOption.action ? styles.optionSelected : ""}`}>
							<input
								name="form-success-action"
								value={actionOption.action}
								checked={dataCollectionSuccessAction === actionOption.action}
								type="radio"
								onChange={(e) => {
									const action = e.target.value;
									setDataCollectionSuccessAction(action);
									updateCampaignData("dataCollectionSuccessAction", action);
								}}
							/>
							{actionOption.label}
						</label>
					))}
				</div>
			</div>
			<br />
			- @todo success URL or Message
			<br />
			- @todo error message
			<br />
		</>
	);
}
