import { useState, useEffect } from "react";
import Head from "next/head";
import FontFamilies from "../../utils/FontFamilies";
import CampaignScreen from "../../components/frontend-components/CampaignScreen";
import ScreensIndicator from "../../components/frontend-components/ScreensIndicator";

export default function PreviewPage({ campaign, errorMessage, screens }) {
	const [activeScreenIndex, setActiveScreenIndex] = useState(0);
	const campaignScreens = screens.slice(0, screens.length - 2);
	const endScreens = screens.slice(screens.length - 2, screens.length);
	const [endScreenData, setEndScreenData] = useState(endScreens[0]); // set success screen as default end screen
	const lastScreenIndex = screens.length - 2;

	const [screenWidth, setScreenWidht] = useState(360);
	const [screenHeight, setScreenHeight] = useState(640);

	/**
	 * Go to the next screen
	 */
	const gotoNextScreen = () => {
		if (activeScreenIndex < lastScreenIndex) {
			setActiveScreenIndex(activeScreenIndex + 1);
		}
	};

	/**
	 * Go to the previous screen
	 */
	const gotoPreviousScreen = () => {
		if (activeScreenIndex > 0) {
			setActiveScreenIndex(activeScreenIndex - 1);
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
		setScreenHeight(window.innerHeight);
		setScreenWidht(window.innerWidth);
	};

	useEffect(() => {
		window.addEventListener("resize", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	/**
	 * @todo display campaign
	 * @todo display preview alert somewhere
	 */

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
					<div
						className="story__screens"
						style={{
							left: `-${activeScreenIndex * screenWidth}px`,
							width: `${screens.length - 1 * screenWidth}px`,
						}}
					>
						{campaignScreens.map((screen, index) => (
							<CampaignScreen key={index} data={screen} width={screenWidth} height={screenHeight} />
						))}
						<CampaignScreen key="endscreen" data={endScreenData} width={screenWidth} height={screenHeight} />
					</div>
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
