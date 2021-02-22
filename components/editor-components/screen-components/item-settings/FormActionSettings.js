import { useContext, useEffect, useState } from "react";
import { DebounceInput } from "react-debounce-input";
import styles from "../ScreenSettings.module.scss";
import { GlobalContext } from "../../../../context/GlobalState";

export default function FormActionSettings() {
	const { campaign, updateCampaignData, setFormResultPreview, formResultPreview } = useContext(GlobalContext);

	const [dataCollectionSuccessAction, setDataCollectionSuccessAction] = useState(campaign.dataCollectionSuccessAction || "popup");
	const [dataCollectionSuccessPopupContent, setDataCollectionSuccessPopupContent] = useState(campaign.dataCollectionSuccessPopupContent || "Thank your for filling the form. We’ll get in touch with you if you are one of our lucky winners. Meanwhile, don’t forget to follow us on Instagram and feel free to visit our website as well.");
	const [dataCollectionErrorMessage, setDataCollectionErrorMessage] = useState(campaign.dataCollectionErrorMessage || "There was an error during the process. Please, wait a few seconds and try again.");

	const [previewActive, setPreviewActive] = useState(formResultPreview || "");

	useEffect(() => {
		setPreviewActive(formResultPreview);
	}, [formResultPreview]);

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
						className={styles.previewButton}
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
						{previewActive && previewActive === "success" ? (
							<>
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
								</svg>
								<span>Close preview</span>
							</>
						) : (
							<>
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
								</svg>
								<span>Preview success state</span>
							</>
						)}
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
					className={styles.previewButton}
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
					{previewActive && previewActive === "error" ? (
						<>
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
							</svg>
							<span>Close preview</span>
						</>
					) : (
						<>
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
							</svg>
							<span>Preview error state</span>
						</>
					)}
				</button>
			</div>
		</>
	);
}
