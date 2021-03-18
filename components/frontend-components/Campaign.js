import { useState, useEffect, useContext } from "react";
import QRCode from "qrcode.react";
import Head from "next/head";
import { FrontendContext } from "../../context/frontend/FrontendState";
import FontFamilies from "../../utils/FontFamilies";
import CampaignScreen from "./CampaignScreen";
import ScreensIndicator from "./ScreensIndicator";
import FormResult from "./screen-items/FormResult";

export default function Campaign({ campaign, screens, previewURL }) {
	const { activeScreenIndex, correctAnswers, formResult } = useContext(FrontendContext);

	const [screen, setScreen] = useState(screens[0]);
	const lastScreenIndex = screens.length - 2; // -2 because the last two screens are the two final screens - success and failure
	const [scale, setScale] = useState(1);
	const [marginLeft, setMarginLeft] = useState(0);

	/**
	 * Set screen size based on window size
	 */
	const handleResize = () => {
		const screenBodyWidth = 360;
		const windowWidth = window.innerWidth;

		if (windowWidth > 767) {
			setScale(1);
			setMarginLeft(0);
			return;
		}

		if (windowWidth < screenBodyWidth) {
			setMarginLeft(((screenBodyWidth - windowWidth) / 2) * (windowWidth / screenBodyWidth) * -1);
		}
		setScale(windowWidth / screenBodyWidth);
	};

	/**
	 * Calculate screen body size on window resize
	 * Set last screen index in global state
	 */
	useEffect(() => {
		// count screen scale ratio
		handleResize();
		window.addEventListener("resize", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	/**
	 * Update screen on screen index change
	 */
	useEffect(() => {
		if (activeScreenIndex === lastScreenIndex && correctAnswers < campaign.successLimit) {
			// on the last screen and wasn't able to collect the right amount of correct answers
			setScreen(screens[lastScreenIndex + 1]);
		} else {
			setScreen(screens[activeScreenIndex]);
		}
	}, [activeScreenIndex, screens, campaign.successLimit, lastScreenIndex, correctAnswers]);

	return (
		<>
			<Head>
				<title>
					PREVIEW - {campaign.name} - {process.env.SITE_NAME}
				</title>

				{/* Campaign custom fonts */}
				{campaign.fonts.length > 0 && <link rel="preconnect" href="https://fonts.gstatic.com" />}
				{campaign.fonts.map((font, index) => font !== "" && FontFamilies[font].url !== "" && <link key={index} href={FontFamilies[font].url} rel="stylesheet" />)}

				{/* Campaign OG data */}
				<meta property="og:type" content="website" />
				{campaign.ogTitle && <meta property="og:title" content={`PREVIEW - ${campaign.ogTitle}`} />}
				{campaign.ogDescription && <meta property="og:description" content={campaign.ogDescription} />}
				{campaign.ogImage && <meta property="og:image" content={campaign.ogImage} />}
			</Head>

			<div className="campaign">
				<div className="story">
					<CampaignScreen data={screen} lastScreenIndex={lastScreenIndex} scale={scale} marginLeft={marginLeft} />
					<ScreensIndicator screens={screens.length - 1} active={activeScreenIndex} />

					{formResult.status && <FormResult status={formResult.status} successContent={formResult.dataCollectionSuccessPopupContent} errorContent={formResult.dataCollectionErrorMessage} />}
				</div>

				<div className="campaign__preview-qr">
					<p>
						Scan the code below to preview on your phone <br />
						<span aria-label="down pointing finger" role="img">
							👇
						</span>
						<span aria-label="down pointing finger" role="img">
							👇
						</span>
						<span aria-label="down pointing finger" role="img">
							👇
						</span>
					</p>
					<QRCode value={previewURL} fgColor={`#20202a`} bgColor={`#ffffff`} size={120} renderAs="svg" includeMargin={true} />
				</div>
			</div>

			<div id="screen-orientation-alert">
				<svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M31 12H18C16.5641 12 15.4 13.1641 15.4 14.6V35.4C15.4 36.8359 16.5641 38 18 38H31C32.4359 38 33.6 36.8359 33.6 35.4V14.6C33.6 13.1641 32.4359 12 31 12Z" stroke="#A30FBB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
					<path d="M24.5 32.8H24.513" stroke="#A30FBB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
					<path d="M5.20833 10.4167V16.6667H11.4583M38.5417 33.3333H44.7917V39.5833" stroke="#A30FBB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
					<path d="M45.8333 23.9583C45.636 19.399 43.9471 15.0305 41.026 11.5242C38.1049 8.01791 34.1134 5.56776 29.6646 4.55022C25.2159 3.53269 20.5561 4.00407 16.4012 5.89195C12.2464 7.77982 8.82635 10.9797 6.66667 15M4.16667 26.0417C4.40512 30.5843 6.12381 34.9241 9.06028 38.3982C11.9968 41.8724 15.9896 44.29 20.4291 45.2818C24.8686 46.2736 29.5106 45.7851 33.6464 43.8909C37.7822 41.9967 41.1844 38.801 43.3333 34.7917" stroke="#A30FBB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
				</svg>
			</div>

			<div id="screen-height-alert">
				<svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M2 13.5714L2 36.4286C2 38.9533 4.01472 41 6.5 41L42.5 41C44.9853 41 47 38.9533 47 36.4286L47 13.5714C47 11.0467 44.9853 9 42.5 9L6.5 9C4.01472 9 2 11.0467 2 13.5714Z" stroke="#A30FBB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
					<path d="M25 11.9645L28.5355 15.5H25H21.4645L25 11.9645Z" fill="#A30FBB" />
					<path d="M25 38.0355L21.4645 34.5L25 34.5L28.5355 34.5L25 38.0355Z" fill="#A30FBB" />
					<path d="M5.46448 24.4645L9.00001 20.9289V24.4645V28L5.46448 24.4645Z" fill="#A30FBB" />
					<path d="M44.0711 24.5355L40.5355 28.0711V24.5355V21L44.0711 24.5355Z" fill="#A30FBB" />
				</svg>

				<p>Please, expand the height of your window to view this experience</p>
			</div>
		</>
	);
}
