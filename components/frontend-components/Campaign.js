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
		</>
	);
}
