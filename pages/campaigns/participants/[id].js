import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSession, getSession } from "next-auth/client";
import LoginForm from "../../../components/LoginForm";
import Sidebar from "../../../components/dashboard-components/Sidebar";
import ParticipantList from "../../../components/dashboard-components/participant-components/ParticipantList";
import Toast from "../../../components/dashboard-components/Toast";
import PageHeader from "../../../components/dashboard-components/PageHeader";

export default function campaignParticipants() {
	const router = useRouter();
	const [session, loading] = useSession();
	const [campaign, setCampaign] = useState({});
	const [toastMessage, setToastMessage] = useState(false);
	const [toastVisible, setToastVisible] = useState(false);
	const [toastType, setToastType] = useState("default");
	const [toastDuration, setToastDuration] = useState(3000);

	if (typeof window !== "undefined" && loading) return null;

	if (!session) {
		return <LoginForm signInPage={true} accessDenied={true} />;
	}

	/**
	 * Get campaign data from the database
	 */
	const getCampaignData = async () => {
		// make sure user is logged in
		if (!session) {
			return;
		}

		const campaignRequest = await fetch(`${process.env.APP_URL}/api/campaigns/data?id=${router.query.id}`, {
			method: "GET",
		});

		const campaign = await campaignRequest.json();

		if (campaign.success !== true) {
			// error
			setToastMessage("Can't get campaign data. Please, try again.");
			setToastType("error");
			setToastDuration(6000);
			setToastVisible(true);
			return;
		}

		if (campaign.data) {
			setCampaign(campaign.data);
		}
		return;
	};

	useEffect(() => {
		getCampaignData();
	}, []);

	return (
		<div id="participants" className="page">
			<Head>
				<title>
					{campaign.name || "..."} - Participants - {process.env.APP_NAME}
				</title>
			</Head>
			<Sidebar />
			<div id="page__content">
				<PageHeader title={`${campaign.name || "..."} - Participants`} secondaryActionLabel="Back to campaigns" secondaryActionURL="/campaigns" />
				<ParticipantList campaignId={router.query.id} hideCampaignSelect={true} />
				{toastVisible && <Toast onClose={() => setToastVisible(false)} duration={toastDuration} type={toastType} content={toastMessage} />}
			</div>
		</div>
	);
}

export async function getServerSideProps(context) {
	const session = await getSession(context);
	return {
		props: { session },
	};
}
