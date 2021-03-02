import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import Head from "next/head";
import { DebounceInput } from "react-debounce-input";
import { GlobalContext } from "../../context/GlobalState";
import styles from "./Header.module.scss";
import CampaignSettings from "./CampaignSettings";
import PublishPanel from "./PublishPanel";
import FontFamilies from "../../utils/FontFamilies";
import SaveStatus from "./header-components/SaveStatus";

export default function Header() {
	const { loading, campaign, updateCampaignData, unsetActiveScreenItem, unsetActiveScreen } = useContext(GlobalContext);
	const [name, setName] = useState(campaign.name || "loading...");
	const [campsignSettingsVisible, setCampaignSettingsVisible] = useState(false);
	const [publishPanelVisible, setPublishPanelVisible] = useState(false);
	const [campaignFonts, setCampaignFonts] = useState(campaign.fonts || []);
	const router = useRouter();

	useEffect(() => {
		setName(campaign.name);

		// update campaign fonts
		setCampaignFonts(campaign.fonts);
	}, [campaign]);

	const hideCampaignSettings = () => {
		setCampaignSettingsVisible(false);
	};

	const hidePublishPanel = () => {
		setPublishPanelVisible(false);
	};

	return (
		<>
			<Head>
				<title>
					{name} - {process.env.APP_NAME}
				</title>
				{campaignFonts && campaignFonts.length > 0 && <link rel="preconnect" href="https://fonts.gstatic.com" />}
				{campaignFonts && campaignFonts.map((font, index) => font !== "" && FontFamilies[font].url !== "" && <link key={index} href={FontFamilies[font].url} rel="stylesheet" />)}
			</Head>
			<div id="editor__header" className={styles.header}>
				<div className={styles.logoContainer}>
					<Link href="/dashboard">
						<a>
							<Image src="/images/logo-white.svg" alt={`${process.env.APP_NAME} logo`} className="logo" width={80} height={28} onClick={() => router.push("/dashboard")} title="Back to the dashboard" />
						</a>
					</Link>
				</div>

				<Link href="/campaigns/">
					<a>Campaigns</a>
				</Link>

				<span className={styles.separator}>&#8725;</span>

				<div className={styles.campaignNameContainer}>
					<DebounceInput
						minLength="3"
						debounceTimeout="1000"
						value={name || ""}
						onChange={(e) => {
							updateCampaignData("name", e.target.value);
							setName(e.target.value);
						}}
					/>
				</div>

				<SaveStatus />

				<a href={`/preview/${campaign._id}`} target="_blank" rel="noopener noreferrer" className={styles.buttonPreview}>
					<span>Preview</span>
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
						<g fill="none">
							<path d="M18 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8c0-1.1.9-2 2-2h5M15 3h6v6M10 14L20.2 3.8" />
						</g>
					</svg>
				</a>
				<button
					className={`${styles.buttonCampaignSettings} button--campaign-settings`}
					disabled={loading}
					onClick={() => {
						setCampaignSettingsVisible(!campsignSettingsVisible);
						unsetActiveScreenItem();
						unsetActiveScreen();
					}}
				>
					Campaign settings
				</button>

				<button
					className={styles.buttonPublish}
					disabled={loading}
					onClick={() => {
						setPublishPanelVisible(!publishPanelVisible);
						unsetActiveScreenItem();
						unsetActiveScreen();
					}}
				>
					Publish
				</button>
			</div>

			{campsignSettingsVisible && <CampaignSettings hideCampaignSettings={hideCampaignSettings} />}
			{publishPanelVisible && <PublishPanel hidePublishPanel={hidePublishPanel} />}
		</>
	);
}
