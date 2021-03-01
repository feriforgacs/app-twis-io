import { useContext, useState, useEffect, useRef } from "react";
import { GlobalContext } from "../../context/GlobalState";
import { DebounceInput } from "react-debounce-input";
import axios from "axios";
import Button from "./sidebar-components/Button";
import ImageUploadPreview from "./sidebar-components/image-components/ImageUploadPreview";
import Toast from "../dashboard-components/Toast";
import "react-day-picker/lib/style.css";
import styles from "./CampaignSettings.module.scss";
import Visibility from "./campaign-settings-components/Visibility";

export default function CampaignSettings({ hideCampaignSettings }) {
	const { campaign, updateCampaignData, updateCampaignDataInState, screens } = useContext(GlobalContext);

	const [uploading, setUploading] = useState(false);
	const [deleting, setDeleting] = useState(false);
	const [requestCancelToken, setRequestCancelToken] = useState();
	const [shareImage, setShareImage] = useState(campaign.ogImage || "");
	const [shareImagePreview, setShareImagePreview] = useState();
	const [toastMessage, setToastMessage] = useState(false);
	const [toastVisible, setToastVisible] = useState(false);
	const [toastType, setToastType] = useState("default");
	const [toastDuration, setToastDuration] = useState(3000);
	const [successLimit, setSuccessLimit] = useState(campaign.successLimit || 0);
	const [questionScreens, setQuestionScreen] = useState(0);

	useEffect(() => {
		const questionScreens = screens.filter((screen) => screen.type === "question");
		setQuestionScreen(questionScreens.length);
	}, [screens]);

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

	/**
	 * Read selected image as data url to upload
	 * @param {object} e Event target object
	 */
	const readSelectedImage = (e) => {
		const image = e.target.files[0];
		// check selected file size
		if (image.size > 2097152) {
			alert("Please, select a smaller file (max 2MB)");
			return;
		}
		const reader = new FileReader();
		reader.readAsDataURL(image);
		reader.onloadend = () => {
			// set preview image
			setShareImagePreview(reader.result);
			// upload image
			uploadImage(reader.result);
		};
	};

	/**
	 * Upload share image
	 */
	const uploadImage = async (image) => {
		setUploading(true);

		if (requestCancelToken) {
			requestCancelToken.cancel();
		}

		let source = axios.CancelToken.source();
		setRequestCancelToken(source);

		try {
			const uploadResult = await axios.put(
				`${process.env.APP_URL}/api/editor/campaign/share-image/upload`,
				{
					campaignId: campaign._id,
					image,
				},
				{
					headers: {
						"Content-Type": "application/json",
					},
				},
				{ cancelToken: source.token }
			);

			// check upload result
			if (uploadResult.data.success !== true) {
				// remove upload preview image from state
				setShareImagePreview("");
				console.log(uploadResult);
				setToastMessage("Can't upload image. Please, try again.");
				setToastType("error");
				setToastDuration(3000);
				setToastVisible(true);
			} else {
				// add share image to state
				setShareImage(uploadResult.data.image);
				updateCampaignDataInState("ogImage", uploadResult.data.image);
			}
		} catch (error) {
			if (axios.isCancel(error)) {
				return;
			}
			// remove upload preview image from state
			setShareImagePreview("");
			console.log(error);
			setToastMessage("Can't upload image. Please, try again.");
			setToastType("error");
			setToastDuration(3000);
			setToastVisible(true);
		}

		setUploading(false);
	};

	/**
	 * Delete OG image
	 */
	const removeShareImage = async () => {
		if (confirm("Are you sure you want to delete the Share Image")) {
			setDeleting(true);

			if (requestCancelToken) {
				requestCancelToken.cancel();
			}

			let source = axios.CancelToken.source();
			setRequestCancelToken(source);

			try {
				const deleteResult = await axios.delete(
					`${process.env.APP_URL}/api/editor/campaign/share-image/delete`,
					{
						data: {
							campaignId: campaign._id,
						},
						headers: {
							"Content-Type": "application/json",
						},
					},
					{ cancelToken: source.token }
				);

				// check upload result
				if (deleteResult.data.success !== true) {
					console.log(deleteResult);
					setToastMessage("Can't delete share image. Please, try again.");
					setToastType("error");
					setToastDuration(3000);
					setToastVisible(true);
				} else {
					// remove share image from state
					setShareImage("");
					updateCampaignDataInState("ogImage", "");
				}
			} catch (error) {
				if (axios.isCancel(error)) {
					return;
				}
				console.log(error);
				setToastMessage("Can't delete share image. Please, try again.");
				setToastType("error");
				setToastDuration(3000);
				setToastVisible(true);
			}

			setDeleting(false);
		}
	};

	return (
		<div className={styles.campaignSettingsPanel} ref={campaignSettingsRef}>
			<Visibility />

			{/* Success limit */}
			<div className={styles.settingsPanelSection}>
				<label className={styles.settingsPanelLabel}>Correct Answer Limit</label>
				<DebounceInput
					className={styles.settingsPanelInput}
					type="number"
					min={0}
					max={questionScreens}
					debounceTimeout="1000"
					value={successLimit || 0}
					onChange={(e) => {
						const limit = parseInt(e.target.value);
						updateCampaignData("successLimit", limit);
						setSuccessLimit(limit);
					}}
				/>
				<p className={styles.settingsPanelHelp}>
					The number of questions your players have to answer properly to successfully complete the quiz. <strong>(min 0, max {questionScreens})</strong>
					<br />
					eg.: 0 - users can successfully complete the quiz without any correct answers, eg.: 5 - at least 5 correct answers is needed to successfully complete the quiz
				</p>
			</div>

			{/* Open Graph Data */}
			<div className={styles.settingsPanelSection}>
				<label className={styles.settingsPanelLabel}>Share Title</label>
				<DebounceInput className={styles.settingsPanelInput} minLength="3" debounceTimeout="1000" value={campaign.ogTitle || ""} onChange={(e) => updateCampaignData("ogTitle", e.target.value)} />
				<p className={styles.settingsPanelHelp}>The title of your campaign page as you would like for it to appear when shared of Facebook, Twitter, etc.</p>
			</div>

			<div className={styles.settingsPanelSection}>
				<label className={styles.settingsPanelLabel}>Share Description</label>
				<DebounceInput className={styles.settingsPanelTextarea} element="textarea" minLength="3" debounceTimeout="1000" value={campaign.ogDescription || ""} onChange={(e) => updateCampaignData("ogDescription", e.target.value)} />
				<p className={styles.settingsPanelHelp}>A brief description of the campaign, usually between 2 and 4 sentences. This will displayed below the title of the post on Facebook, Twitter, etc.</p>
			</div>

			<div className={styles.settingsPanelSection}>
				<label className={styles.settingsPanelLabel}>Share Image</label>
				<div className={styles.settingsPanelImagePreview}>
					{shareImagePreview && uploading && <ImageUploadPreview thumb={shareImagePreview} caption={"Share Image"} />}
					{shareImage && !uploading && <img src={shareImage} alt="Share Image" />}
					{shareImage && !uploading && <Button buttonType="buttonOutlineDanger" label={`${deleting ? "Deleting image..." : "Delete Share Image"}`} disabled={deleting || uploading} onClick={() => removeShareImage()} />}
				</div>

				<div className={styles.imageUploadContainer}>
					<Button label={`${uploading ? "Uploading image..." : "Upload Share Image"}`} disabled={uploading || deleting} />
					<input type="file" accept=".jpg,.jpeg,.gif,.png,.svg" onChange={(e) => readSelectedImage(e)} name="image" disabled={uploading} />
					<small>(max 2MB)</small>
				</div>
				<p className={styles.settingsPanelHelp}>The image that appears when someone shares the campaign to Facebook, Twitter, etc. Ideal size 1200x627 pixels.</p>
			</div>

			{toastVisible && <Toast onClose={() => setToastVisible(false)} duration={toastDuration} type={toastType} content={toastMessage} />}
		</div>
	);
}
