/**
 * @todo display first screen
 * @todo display screens indicator
 * @todo go to next screen
 * @todo go to previous screen
 * @todo calculate screen size
 */
import { useState, useEffect } from "react";
import Head from "next/head";
import FontFamilies from "../../utils/FontFamilies";
import CampaignScreen from "../../components/frontend-components/CampaignScreen";
import ScreensIndicator from "../../components/frontend-components/ScreensIndicator";

export default function PreviewPage({ campaign, errorMessage, screens }) {
	const [activeScreenIndex, setActiveScreenIndex] = useState(0);
	const [screen, setScreen] = useState(screens[0]);
	const lastScreenIndex = screens.length - 2;

	/**
	 * Go to the next screen
	 */
	const gotoNextScreen = () => {
		if (activeScreenIndex < lastScreenIndex) {
			setActiveScreenIndex(activeScreenIndex + 1);
			setScreen(screens[activeScreenIndex + 1]);
		}
	};

	/**
	 * Go to the previous screen
	 */
	const gotoPreviousScreen = () => {
		if (activeScreenIndex > 0) {
			setActiveScreenIndex(activeScreenIndex - 1);
			setScreen(screens[activeScreenIndex - 1]);
		}
	};

	/**
	 * Go to next or previous screen based on click location
	 * @param {obj} e click event object
	 */
	const handleClick = (e) => {
		if (e.pageX >= window.innerWidth * 0.45) {
			gotoNextScreen();
		} else {
			gotoPreviousScreen();
		}
	};

	/**
	 * Set screen size based on window size
	 */
	const handleResize = () => {
		/**
		 * @todo calculate screen width and height based on window size
		 */
	};

	useEffect(() => {
		window.addEventListener("resize", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	// display error message if there is one
	if (errorMessage) return <p>{errorMessage}</p>;

	return (
		<>
			<Head>
				<title>
					PREVIEW - {campaign.name} - {process.env.SITE_NAME}
				</title>

				{campaign.fonts.length > 0 && <link rel="preconnect" href="https://fonts.gstatic.com" />}
				{campaign.fonts.map((font, index) => font !== "" && FontFamilies[font].url !== "" && <link key={index} href={FontFamilies[font].url} rel="stylesheet" />)}

				<meta property="og:type" content="website" />
				<meta property="og:url" content="TODO" />
				{campaign.ogTitle && <meta property="og:title" content={campaign.ogTitle} />}
				{campaign.ogDescription && <meta property="og:description" content={campaign.ogDescription} />}
				{campaign.ogImage && <meta property="og:image" content={campaign.ogImage} />}
			</Head>

			<div className="campaign" onClick={(e) => handleClick(e)}>
				<div className="story">
					<CampaignScreen data={screen} />
					<ScreensIndicator screens={screens.length - 1} active={activeScreenIndex} />
				</div>
			</div>
		</>
	);
}

export async function getServerSideProps(context) {
	const { id } = context.query;

	let errorMessage = "";
	let campaign = {};
	let screens = [];

	// get campaign data from the database
	try {
		const campaignRequest = await fetch(`${process.env.APP_URL}/api/campaigns/view?id=${id}`, {
			method: "GET",
		});

		const campaignResult = await campaignRequest.json();

		if (campaignResult.success !== true) {
			// error
			errorMessage = "Can't get campaign data from the database. Please, wait a few minutes and try again";
		} else {
			screens = campaignResult.screens;
			campaign = campaignResult.campaign;
		}
	} catch (error) {
		errorMessage = "Can't get campaign data from the database. Please, wait a few minutes and try again";
	}

	return {
		props: {
			campaign,
			screens,
			errorMessage,
		},
	};
}
