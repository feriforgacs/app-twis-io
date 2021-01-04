import { useState } from "react";
import { useSession, getSession } from "next-auth/client";
import LoginForm from "../components/LoginForm";
import Sidebar from "../components/dashboard-components/Sidebar";
import Toast from "../components/dashboard-components/Toast";
import DashboardSection from "../components/dashboard-components/DashboardSection";
import CampaignList from "../components/dashboard-components/campaign-components/CampaignList";

export default function dashboard() {
	const [session, loading] = useSession();
	const [toastVisible, setToastVisible] = useState(true);

	if (typeof window !== "undefined" && loading) return null;

	if (!session) {
		return <LoginForm signInPage={true} accessDenied={true} />;
	}

	return (
		<div id="dashboard" className="page">
			<Sidebar />
			<div id="page__content">
				<header id="page__header">
					<h1 className="page__title">Dashboard</h1>
					<div id="page__actions">
						<button className="button button--primary button--slim">Create New Campaign</button>
					</div>
				</header>

				<DashboardSection id="latest-campaigns" title="Latest Campaigns" actionLabel="View all campaigns" actionURL="/campaigns" />
				<CampaignList />

				<DashboardSection id="latest-participants" title="Latest Participants" actionLabel="View all participants" actionURL="/participants" />

				{toastVisible && <Toast onClose={() => setToastVisible(false)} duration={3000} content={`Test toast...`} />}
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
