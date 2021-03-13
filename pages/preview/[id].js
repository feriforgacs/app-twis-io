import { FrontendProvider } from "../../context/frontend/FrontendState";
import Campaign from "../../components/frontend-components/Campaign";

export default function PreviewPage({ campaign, errorMessage, screens }) {
	// display error message if there is one
	if (errorMessage) return <p>{errorMessage}</p>;

	return (
		<FrontendProvider>
			<Campaign campaign={campaign} screens={screens} />
		</FrontendProvider>
	);
}

// get campaign data on server side
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
