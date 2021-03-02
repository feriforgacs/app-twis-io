import { useEffect, useState } from "react";
import NProgress from "nprogress";

export default function PreviewPage({ campaign, errorMessage }) {
	const [loading, setLoading] = useState(true);

	/**
	 * @todo get campaign screens from the db
	 * @todo display campaign
	 * @todo display preview alert somewhere
	 */

	return <div>{errorMessage ? <p>{errorMessage}</p> : ""}Preview campaign</div>;
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
