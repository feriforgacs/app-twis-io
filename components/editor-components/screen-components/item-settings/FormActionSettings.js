import { useContext, useState } from "react";
import { DebounceInput } from "react-debounce-input";
import styles from "../ScreenSettings.module.scss";
import { GlobalContext } from "../../../../context/GlobalState";

export default function FormActionSettings() {
	const { campaign, updateCampaignData } = useContext(GlobalContext);

	const [dataCollectionSuccessAction, setDataCollectionSuccessAction] = useState(campaign.dataCollectionSuccessAction || "popup");
	const [dataCollectionSuccessPopupContent, setDataCollectionSuccessPopupContent] = useState(campaign.dataCollectionSuccessPopupContent || "Thank your for filling the form. We’ll get in touch with you if you are one of our lucky winners. Meanwhile, don’t forget to follow us on Instagram and feel free to visit our website as well.");

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

	const [successRedirectURL, setSuccessRedirectURL] = useState(campaign.dataCollectionSuccessRedirectURL || "");

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
			{dataCollectionSuccessAction === "popup" && (
				<div className={`${styles.settingsSection} item-settings`}>
					<label className={`${styles.settingsLabel} item-settings`}>Success message after form completion</label>

					<DebounceInput
						element="textarea"
						className={styles.popupContentTextarea}
						minLength="3"
						debounceTimeout="1000"
						value={dataCollectionSuccessPopupContent}
						onChange={(e) => {
							const content = e.target.value;
							setDataCollectionSuccessPopupContent(content);
							updateCampaignData("dataCollectionSuccessPopupContent", content);
						}}
					/>
				</div>
			)}
			{dataCollectionSuccessAction === "redirect" && (
				<div className={`${styles.settingsSection} item-settings`}>
					<label className={`${styles.settingsLabel} item-settings`}>Redirect the user to the following URL</label>

					<DebounceInput
						className={styles.redirectURLInput}
						minLength="3"
						placeholder="https://"
						debounceTimeout="1000"
						value={successRedirectURL}
						onChange={(e) => {
							const redirectURL = e.target.value;
							setSuccessRedirectURL(redirectURL);
							updateCampaignData("dataCollectionSuccessRedirectURL", redirectURL);
						}}
					/>
				</div>
			)}
			<br />
			- @todo success URL or Message
			<br />
			- @todo error message
			<br />
		</>
	);
}
