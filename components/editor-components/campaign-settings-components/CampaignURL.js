import { useContext, useState } from "react";
import slug from "slug";
import axios from "axios";
import { DebounceInput } from "react-debounce-input";
import { GlobalContext } from "../../../context/GlobalState";
import styles from "../CampaignSettings.module.scss";

export default function CampaignURL() {
	const { campaign, updateCampaignDataInState } = useContext(GlobalContext);
	const [requestCancelToken, setRequestCancelToken] = useState();
	const [url, setURL] = useState(campaign.url);
	const [updateError, setUpdateError] = useState("");
	const [lengthError, setLengthError] = useState(false);

	/**
	 * Update campaign URL in the database
	 * @param {string} url New campaign URL
	 */
	const updateCampaignURL = async (url) => {
		if (requestCancelToken) {
			requestCancelToken.cancel();
		}

		setLengthError(false);
		setUpdateError("");

		let source = axios.CancelToken.source();
		setRequestCancelToken(source);

		try {
			const updateResult = await axios.post(
				`/api/editor/campaign/url`,
				{
					campaignId: campaign._id,
					url,
				},
				{
					headers: {
						"Content-Type": "application/json",
					},
				},
				{ cancelToken: source.token }
			);

			if (updateResult.data.success !== true) {
				console.log(updateResult);
				setUpdateError(updateResult.data.errorMessage);
			} else {
				// add url to state
				updateCampaignDataInState("url", url);
			}
		} catch (error) {
			if (axios.isCancel(error)) {
				return;
			}
			console.log(error);
			setUpdateError("An error occurred. Please, try again.");
		}
	};

	return (
		<div className={styles.settingsPanelSection}>
			<label className={styles.settingsPanelLabel}>Campaign URL</label>
			<div className={styles.campaignURLContainer}>
				<span>{process.env.CAMPAIGN_URL_PREFIX_SHORT}</span>
				<DebounceInput
					className={`${styles.settingsPanelInput} ${updateError || lengthError ? styles.invalidValue : ""}`}
					maxLength="250"
					debounceTimeout="1000"
					value={url}
					onChange={(e) => {
						setUpdateError("");
						let newURL = slug(e.target.value);
						setURL(newURL);

						if (newURL.length < 5 || newURL.length > 250) {
							setLengthError(true);
							return;
						}
						updateCampaignURL(newURL);
					}}
				/>
			</div>
			{lengthError && (
				<p className={styles.valueError}>
					<svg viewBox="0 0 20 20">
						<path d="M10 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm-1-8h2V6H9v4zm0 4h2v-2H9v2z"></path>
					</svg>{" "}
					The length of the URL should be between 5 to 250 characters.
				</p>
			)}

			{updateError && (
				<p className={styles.valueError}>
					<svg viewBox="0 0 20 20">
						<path d="M10 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm-1-8h2V6H9v4zm0 4h2v-2H9v2z"></path>
					</svg>{" "}
					{updateError}
				</p>
			)}
			<p className={styles.settingsPanelHelp}>
				This is the URL you can use to share your campaign with your audience. <strong>It should be at least 5 characters long.</strong>
			</p>
		</div>
	);
}
