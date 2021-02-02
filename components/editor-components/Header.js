import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import Head from "next/head";
import { GlobalContext } from "../../context/GlobalState";
import styles from "./Header.module.scss";
import CampaignSettings from "./CampaignSettings";

export default function Header() {
	const { loading, campaign, updateCampaignData } = useContext(GlobalContext);
	const [name, setName] = useState(campaign.name);
	const [campsignSettingsVisible, toggleCampaignSettings] = useState(false);
	const router = useRouter();

	const updateData = (campaignName) => {
		if (campaignName.length <= 3) {
			alert("Campaign name should be at least 3 characters long");
			return;
		}

		updateCampaignData("name", campaignName);
	};

	useEffect(() => {
		setName(campaign.name);
	}, [campaign]);

	return (
		<>
			<Head>
				<title>
					{name} - {process.env.APP_NAME}
				</title>
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

				<form
					className={styles.campaignNameContainer}
					onSubmit={(e) => {
						e.preventDefault();
						updateData(name);
					}}
					disabled={loading}
				>
					<input type="text" value={name || ""} onChange={(e) => setName(e.target.value)} disabled={loading} />
					<span className={styles.editIcon}>
						<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#000000" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
							<polygon points="14 2 18 6 7 17 3 17 3 13 14 2"></polygon>
							<line x1="3" y1="20" x2="20" y2="20"></line>
						</svg>
					</span>
				</form>

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
