import { useState } from "react";
import Head from "next/head";
import NProgress from "nprogress";
import FontFamilies from "../../utils/FontFamilies";
import FrontendScreen from "../../components/frontend-components/FrontendScreen";

export default function PreviewPage({ campaign, errorMessage, screens }) {
	const [loading, setLoading] = useState(true);

	// display error message if there is one
	if (errorMessage) return <p>{errorMessage}</p>;

	/**
	 * @todo display campaign
	 * @todo display preview alert somewhere
	 */

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
			<div className="twis-campaign">
				{screens.map((screen, index) => (
					<FrontendScreen key={index} data={screen} />
				))}
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
