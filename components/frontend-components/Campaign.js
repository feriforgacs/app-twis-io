/**
 * @todo display screen items
 * @todo calculate screen size
 * @todo handle form submit
 */
import { useState, useEffect, useContext } from "react";
import Head from "next/head";
import { FrontendContext } from "../../context/frontend/FrontendState";
import FontFamilies from "../../utils/FontFamilies";
import CampaignScreen from "./CampaignScreen";
import ScreensIndicator from "./ScreensIndicator";

export default function Campaign({ campaign, screens }) {
	const { activeScreenIndex, correctAnswers } = useContext(FrontendContext);
	const [screen, setScreen] = useState(screens[0]);
	const lastScreenIndex = screens.length - 2; // -2 because the last two screens are the two final screens - success or failure

	/**
	 * Set screen size based on window size
	 */
	const handleResize = () => {
		/**
		 * @todo calculate screen width and height based on window size
		 */
	};

	/**
	 * Calculate screen body size on window resize
	 * Set last screen index in global state
	 */
	useEffect(() => {
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
				<meta property="og:url" content="TODO" />
				{campaign.ogTitle && <meta property="og:title" content={campaign.ogTitle} />}
				{campaign.ogDescription && <meta property="og:description" content={campaign.ogDescription} />}
				{campaign.ogImage && <meta property="og:image" content={campaign.ogImage} />}
			</Head>

			<div className="campaign">
				<div className="story">
					<CampaignScreen data={screen} lastScreenIndex={lastScreenIndex} />
					<ScreensIndicator screens={screens.length - 1} active={activeScreenIndex} />
				</div>
			</div>
		</>
	);
}
