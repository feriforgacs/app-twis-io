/**
 * @todo design for preview buttons
 * @todo manage state of preview buttons
 */
import { useContext, useState } from "react";
import { DebounceInput } from "react-debounce-input";
import styles from "../ScreenSettings.module.scss";
import { GlobalContext } from "../../../../context/GlobalState";

export default function FormActionSettings() {
	const { campaign, updateCampaignData, setFormResultPreview } = useContext(GlobalContext);

	const [dataCollectionSuccessAction, setDataCollectionSuccessAction] = useState(campaign.dataCollectionSuccessAction || "popup");
	const [dataCollectionSuccessPopupContent, setDataCollectionSuccessPopupContent] = useState(campaign.dataCollectionSuccessPopupContent || "Thank your for filling the form. We’ll get in touch with you if you are one of our lucky winners. Meanwhile, don’t forget to follow us on Instagram and feel free to visit our website as well.");
	const [dataCollectionErrorMessage, setDataCollectionErrorMessage] = useState(campaign.dataCollectionErrorMessage || "There was an error during the process. Please, wait a few seconds and try again.");

	const [previewActive, setPreviewActive] = useState("");

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
					<span className={styles.helpText}>
						This is the message that users will see when the data collection form was processed successfully. You can use{" "}
						<a href="https://www.markdownguide.org/cheat-sheet/" target="_blank" rel="noopener noreferrer">
							markdown
						</a>{" "}
						to format your message.
					</span>

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
					<button
						onClick={() => {
							if (!previewActive || previewActive !== "success") {
								setFormResultPreview("success");
								setPreviewActive("success");
							} else {
								setFormResultPreview("");
								setPreviewActive("");
							}
						}}
					>
						{previewActive && previewActive === "success" ? "Close preview" : "Preview success state"}
					</button>
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

			<div className={`${styles.settingsSection} item-settings`}>
				<label className={`${styles.settingsLabel} item-settings`}>Error message after form completion</label>
				<span className={styles.helpText}>This is the message that users will see if something goes wrong during the data collection process.</span>

				<DebounceInput
					element="textarea"
					className={styles.errorMessageTextare}
					minLength="3"
					debounceTimeout="1000"
					value={dataCollectionErrorMessage}
					onChange={(e) => {
						const content = e.target.value;
						setDataCollectionErrorMessage(content);
						updateCampaignData("dataCollectionErrorMessage", content);
					}}
				/>
				<button
					onClick={() => {
						if (!previewActive || previewActive !== "error") {
							setFormResultPreview("error");
							setPreviewActive("error");
						} else {
							setFormResultPreview("");
							setPreviewActive("");
						}
					}}
				>
					{previewActive && previewActive === "error" ? "Close preview" : "Preview error state"}
				</button>
			</div>
		</>
	);
}
