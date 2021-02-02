import { useContext, useState } from "react";
import Switch from "react-switch";
import { GlobalContext } from "../../context/GlobalState";
import styles from "./CampaignSettings.module.scss";
import DayPickerInput from "react-day-picker/DayPickerInput";
import { DateUtils } from "react-day-picker";
import dateFnsFormat from "date-fns/format";
import dateFnsParse from "date-fns/parse";
import { DebounceInput } from "react-debounce-input";
import "react-day-picker/lib/style.css";

export default function CampaignSettings() {
	const { campaign, updateCampaignData } = useContext(GlobalContext);
	const [active, setActive] = useState(campaign.status === "active" || false);
	const [visibleFrom, setVisibleFrom] = useState(new Date(campaign.visibleFrom) || new Date());
	const [visibleTo, setVisibleTo] = useState(new Date(campaign.visibleTo) || new Date());

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
					<span>
						Status: <strong>{campaign.status === "active" ? "Active" : "Inactive"}</strong>
					</span>
				</label>
				<p className={styles.settingsPanelHelp}>
					Your campaign is <strong>{campaign.status === "active" ? "active" : "inactive"}</strong>. You can change the status by clicking on the toggle above.
				</p>
			</div>

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
		</div>
	);
}
