import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import Head from "next/head";
import { DebounceInput } from "react-debounce-input";
import { GlobalContext } from "../../context/GlobalState";
import styles from "./Header.module.scss";
import CampaignSettings from "./CampaignSettings";
import FontFamilies from "../../utils/FontFamilies";

export default function Header() {
	const { loading, campaign, updateCampaignData } = useContext(GlobalContext);
	const [name, setName] = useState(campaign.name || "loading...");
	const [campsignSettingsVisible, toggleCampaignSettings] = useState(false);
	const [campaignFonts, setCampaignFonts] = useState(campaign.fonts || []);
	const router = useRouter();

	useEffect(() => {
		setName(campaign.name);

		// update campaign fonts
		setCampaignFonts(campaign.fonts);
	}, [campaign]);

	return (
		<>
			<Head>
				<title>
					{name} - {process.env.APP_NAME}
				</title>
				{campaignFonts && campaignFonts.length > 0 && <link rel="preconnect" href="https://fonts.gstatic.com" />}
				{campaignFonts && campaignFonts.map((font, index) => FontFamilies[font].url !== "" && <link key={index} href={FontFamilies[font].url} rel="stylesheet" />)}
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

				<button className={styles.buttonCampaignSettings} disabled={loading} onClick={() => toggleCampaignSettings(!campsignSettingsVisible)}>
					Campaign Settings{" "}
					{campsignSettingsVisible ? (
						<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
							<line x1="18" y1="6" x2="6" y2="18"></line>
							<line x1="6" y1="6" x2="18" y2="18"></line>
						</svg>
					) : (
						<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
							<circle cx="12" cy="12" r="1"></circle>
							<circle cx="19" cy="12" r="1"></circle>
							<circle cx="5" cy="12" r="1"></circle>
						</svg>
					)}
				</button>
				<button className={styles.buttonShare} disabled={loading}>
					Share{" "}
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
						<circle cx="18" cy="5" r="3"></circle>
						<circle cx="6" cy="12" r="3"></circle>
						<circle cx="18" cy="19" r="3"></circle>
						<line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
						<line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
					</svg>
				</button>
			</div>

			{campsignSettingsVisible && <CampaignSettings />}
		</>
	);
}
