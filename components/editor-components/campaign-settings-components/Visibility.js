import { useContext, useState } from "react";
import Switch from "react-switch";
import DayPickerInput from "react-day-picker/DayPickerInput";
import { DateUtils } from "react-day-picker";
import dateFnsFormat from "date-fns/format";
import dateFnsParse from "date-fns/parse";
import { GlobalContext } from "../../../context/GlobalState";
import "react-day-picker/lib/style.css";
import styles from "../CampaignSettings.module.scss";
import Usage from "./Usage";

export default function Visibility() {
	const { campaign, updateCampaignData } = useContext(GlobalContext);
	const campaignURL = `${process.env.CAMPAIGN_URL_PREFIX}${campaign.url}`;

	const [active, setActive] = useState(campaign.status === "active" || false);
	const [visibleFrom, setVisibleFrom] = useState(new Date(campaign.visibleFrom) || new Date());
	const [visibleTo, setVisibleTo] = useState(new Date(campaign.visibleTo) || new Date());

	const dateFormat = "do MMM yyyy";

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

	let balloons = [];
	for (let i = 0; i < 10; i++) {
		let balloon = (
			<span key={i}>
				<strong>🎈</strong>
			</span>
		);
		balloons.push(balloon);
	}

	return (
		<>
			{/* Campaign Status */}
			<div className={styles.settingsPanelSection}>
				<label className={styles.settingsPanelLabel}>
					<Switch
						onChange={() => {
							setActive(!active);
							updateCampaignData("status", campaign.status === "active" ? "draft" : "active");
						}}
						checked={active}
						onColor="#159c5b"
					/>
					<span>
						Status: <strong>{campaign.status === "active" ? "Active" : "Inactive"}</strong>
					</span>
				</label>
				<p className={styles.settingsPanelHelp}>
					Your campaign is <strong>{campaign.status === "active" ? "active" : "inactive"}</strong>. You can change the status by clicking on the toggle above.
					{active && (
						<>
							<br />
							<a href={campaignURL} target="_blank" rel="noopener noreferrer" className={styles.settingsPanelLink}>
								View campaign
								<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#5a38fd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
									<g fill="none">
										<path d="M18 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8c0-1.1.9-2 2-2h5M15 3h6v6M10 14L20.2 3.8" />
									</g>
								</svg>
							</a>
						</>
					)}
				</p>

				<div className={`${styles.balloons} ${styles.animate}`}>{balloons}</div>
			</div>

			{/* Campaign Visiblity Dates */}
			{active && (
				<>
					<Usage />
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
		</>
	);
}
