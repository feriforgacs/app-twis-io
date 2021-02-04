import { useContext, useState } from "react";
import Switch from "react-switch";
import { GlobalContext } from "../../context/GlobalState";
import DayPickerInput from "react-day-picker/DayPickerInput";
import { DateUtils } from "react-day-picker";
import dateFnsFormat from "date-fns/format";
import dateFnsParse from "date-fns/parse";
import { DebounceInput } from "react-debounce-input";
import axios from "axios";
import Button from "./sidebar-components/Button";
import ImageUploadPreview from "./sidebar-components/image-components/ImageUploadPreview";
import Toast from "../dashboard-components/Toast";
import "react-day-picker/lib/style.css";
import styles from "./CampaignSettings.module.scss";

export default function CampaignSettings() {
	const { campaign, updateCampaignData, updateCampaignDataState } = useContext(GlobalContext);
	const [active, setActive] = useState(campaign.status === "active" || false);
	const [visibleFrom, setVisibleFrom] = useState(new Date(campaign.visibleFrom) || new Date());
	const [visibleTo, setVisibleTo] = useState(new Date(campaign.visibleTo) || new Date());
	const [uploading, setUploading] = useState(false);
	const [deleting, setDeleting] = useState(false);
	const [requestCancelToken, setRequestCancelToken] = useState();
	const [shareImage, setShareImage] = useState(campaign.ogImage || "");
	const [shareImagePreview, setShareImagePreview] = useState();
	const [toastMessage, setToastMessage] = useState(false);
	const [toastVisible, setToastVisible] = useState(false);
	const [toastType, setToastType] = useState("default");
	const [toastDuration, setToastDuration] = useState(3000);

	const dateFormat = "yyyy.MM.dd.";

	const parseDate = (str, format, locale) => {
		const parsed = dateFnsParse(str, format, new Date(), { locale });
		if (DateUtils.isDate(parsed)) {
			return parsed;
		}
		return undefined;
	};

	const formatDate = (date, format, locale) => {
		return dateFnsFormat(date, format, { locale });
	};

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
				updateCampaignDataState("ogImage", uploadResult.data.image);
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
					updateCampaignDataState("ogImage", "");
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
		<div className={styles.campaignSettingsPanel}>
			{/* Campaign Status */}
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
					<span>
						Status: <strong>{campaign.status === "active" ? "Active" : "Inactive"}</strong>
					</span>
				</label>
				<p className={styles.settingsPanelHelp}>
					Your campaign is <strong>{campaign.status === "active" ? "active" : "inactive"}</strong>. You can change the status by clicking on the toggle above.
				</p>
			</div>

			{/* Campaign Visiblity Dates */}
			{active && (
				<>
					<div className={styles.settingsPanelSection}>
						<label className={styles.settingsPanelLabel}>Campaign Visible From</label>
						<DayPickerInput
							format={dateFormat}
							parseDate={parseDate}
							value={dateFnsFormat(new Date(visibleFrom), dateFormat)}
							inputProps={{ readOnly: true }}
							dayPickerProps={{ disabledDays: { before: new Date() }, firstDayOfWeek: 1 }}
							onDayChange={(day) => {
								setVisibleFrom(day);
								updateCampaignData("visibleFrom", day);
							}}
						/>
						<p className={styles.settingsPanelHelp}>From this date, the visitors of the campaign can submit their answers to the questions.</p>
					</div>

					<div className={styles.settingsPanelSection}>
						<label className={styles.settingsPanelLabel}>Campaign Visible To</label>
						<DayPickerInput
							formatDate={formatDate}
							format={dateFormat}
							parseDate={parseDate}
							value={dateFnsFormat(new Date(visibleTo), dateFormat)}
							inputProps={{ readOnly: true }}
							dayPickerProps={{ disabledDays: { before: new Date(visibleFrom) }, firstDayOfWeek: 1 }}
							onDayChange={(day) => {
								setVisibleTo(day);
								updateCampaignData("visibleTo", day);
							}}
						/>
						<p className={styles.settingsPanelHelp}>This is the last date when your players can submit their answers.</p>
					</div>
				</>
			)}

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
