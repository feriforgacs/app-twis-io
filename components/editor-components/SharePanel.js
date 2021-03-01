import { useEffect, useRef } from "react";
import styles from "./CampaignSettings.module.scss";
import ScreenInfo from "./screen-components/screen-settings/ScreenInfo";

export default function SharePanel({ hideSharePanel }) {
	const sharePanelRef = useRef();

	const handleClickOutside = (e) => {
		if (sharePanelRef.current && !sharePanelRef.current.contains(e.target)) {
			hideSharePanel();
		}
	};

	useEffect(() => {
		document.addEventListener("click", handleClickOutside);
		return () => {
			document.removeEventListener("click", handleClickOutside);
		};
	});

	return (
		<div className={styles.campaignSettingsPanel} ref={sharePanelRef}>
			<ScreenInfo screenType="sharePanel" />
			<div className={styles.settingsPanelSection}>
				<a href="https://twis.io" target="_blank" rel="noopener noreferrer" className={`${styles.shareButtonFacebook} ${styles.shareButton}`}>
					<span className={styles.shareIcon}>
						<svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 512 512" width="20" fill="#ffffff">
							<path d="M512,257.555c0,-141.385 -114.615,-256 -256,-256c-141.385,0 -256,114.615 -256,256c0,127.777 93.616,233.685 216,252.89l0,-178.89l-65,0l0,-74l65,0l0,-56.4c0,-64.16 38.219,-99.6 96.695,-99.6c28.009,0 57.305,5 57.305,5l0,63l-32.281,0c-31.801,0 -41.719,19.733 -41.719,39.978l0,48.022l71,0l-11.35,74l-59.65,0l0,178.89c122.385,-19.205 216,-125.113 216,-252.89Z" />
						</svg>
					</span>
					<span>Share on Facebook</span>
				</a>

				<a href="https://twis.io" target="_blank" rel="noopener noreferrer" className={`${styles.shareButtonTwitter} ${styles.shareButton}`}>
					<span className={styles.shareIcon}>
						<svg height="20" width="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
							<path d="M0 0h24v24H0z" opacity="0"></path>
							<path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z" fill="#ffffff"></path>
						</svg>
					</span>
					<span>Share on Twitter</span>
				</a>

				<a href="https://twis.io" target="_blank" rel="noopener noreferrer" className={`${styles.shareButtonTelegram} ${styles.shareButton}`}>
					<span className={styles.shareIcon}>
						<svg height="20" viewBox="0 0 512 512" width="20" xmlns="http://www.w3.org/2000/svg">
							<path d="M484.689,98.231l-69.417,327.37c-5.237,23.105-18.895,28.854-38.304,17.972L271.2,365.631 l-51.034,49.086c-5.646,5.647-10.371,10.372-21.256,10.372l7.598-107.722L402.539,140.23c8.523-7.598-1.848-11.809-13.247-4.21 L146.95,288.614L42.619,255.96c-22.694-7.086-23.104-22.695,4.723-33.579L455.423,65.166 C474.316,58.081,490.85,69.375,484.689,98.231z" fill="#ffffff" />
						</svg>
					</span>
					<span>Send on Telegram</span>
				</a>

				<a href="https://twis.io" target="_blank" rel="noopener noreferrer" className={`${styles.shareButtonEmail} ${styles.shareButton}`}>
					<span className={styles.shareIcon}>
						<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
							<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
							<polyline points="22,6 12,13 2,6"></polyline>
						</svg>
					</span>
					<span>Share via Email</span>
				</a>

				<a href="https://twis.io" target="_blank" rel="noopener noreferrer" className={`${styles.shareButtonLink} ${styles.shareButton}`}>
					<span className={styles.shareIcon}>
						<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
							<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
							<path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
						</svg>
					</span>
					<span>Copy link</span>
				</a>
			</div>
		</div>
	);
}
