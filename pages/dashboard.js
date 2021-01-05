import { useState } from "react";
import { useSession, getSession } from "next-auth/client";
import Head from "next/head";
import LoginForm from "../components/LoginForm";
import Sidebar from "../components/dashboard-components/Sidebar";
import CampaignList from "../components/dashboard-components/campaign-components/CampaignList";
import ParticipantList from "../components/dashboard-components/participant-components/ParticipantList";

export default function dashboard() {
	const [session, loading] = useSession();
	const [toastVisible, setToastVisible] = useState(true);

	if (typeof window !== "undefined" && loading) return null;

	if (!session) {
		return <LoginForm signInPage={true} accessDenied={true} />;
	}

	return (
		<div id="dashboard" className="page">
			<Head>
				<title>Dashboard - twis</title>
			</Head>
			<Sidebar />
			<div id="page__content">
				<header id="page__header">
					<h1 className="page__title">Dashboard</h1>
					<div id="page__actions">
						<button className="button button--primary button--slim">Create New Campaign</button>
					</div>
				</header>

				<CampaignList dashboard={true} />
				<ParticipantList dashboard={true} />
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
