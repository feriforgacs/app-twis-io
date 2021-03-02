import { useEffect, useState } from "react";
import Head from "next/head";
import NProgress from "nprogress";
import FontFamilies from "../../utils/FontFamilies";

export default function PreviewPage({ campaign, errorMessage }) {
	const [loading, setLoading] = useState(true);

	/**
	 * @todo get campaign screens from the db
	 * @todo display campaign
	 * @todo display preview alert somewhere
	 */

	return (
		<>
			<Head>
				<title>
					Preview - {campaign.name} - {process.env.SITE_NAME}
				</title>

				{campaign.fonts.length > 0 && <link rel="preconnect" href="https://fonts.gstatic.com" />}
				{campaign.fonts.map((font, index) => font !== "" && FontFamilies[font].url !== "" && <link key={index} href={FontFamilies[font].url} rel="stylesheet" />)}

				<meta property="og:type" content="website" />
				<meta property="og:url" content="TODO" />
				{campaign.ogTitle && <meta property="og:title" content={campaign.ogTitle} />}
				{campaign.ogDescription && <meta property="og:description" content={campaign.ogDescription} />}
				{campaign.ogImage && <meta property="og:image" content={campaign.ogImage} />}
			</Head>
			<div>{errorMessage ? <p>{errorMessage}</p> : ""}Preview campaign</div>
		</>
	);
}

export async function getServerSideProps(context) {
	const { id } = context.query;

	let errorMessage = "";
	let campaign;

	// get campaign data from the database
	try {
		const campaignsRequest = await fetch(`${process.env.APP_URL}/api/campaigns/view?id=${id}`, {
			method: "GET",
		});

		campaign = await campaignsRequest.json();

		if (campaign.success !== true) {
			// error
			errorMessage = "Can't get campaign data from the database. Please, wait a few minutes and try again";
			return;
		}
		campaign = campaign.data;
	} catch (error) {
		errorMessage = "Can't get campaign data from the database. Please, wait a few minutes and try again";
	}

	return {
		props: {
			campaign,
			errorMessage,
		},
	};
}
