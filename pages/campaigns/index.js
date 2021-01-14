import Head from "next/head";
import { useSession, getSession } from "next-auth/client";
import LoginForm from "../../components/LoginForm";
import Sidebar from "../../components/dashboard-components/Sidebar";
import CampaignList from "../../components/dashboard-components/campaign-components/CampaignList";
import PageHeader from "../../components/dashboard-components/PageHeader";

export default function Campaigns() {
	const [session, loading] = useSession();

	if (typeof window !== "undefined" && loading) return null;

	if (!session) {
		return <LoginForm signInPage={true} accessDenied={true} />;
	}

	return (
		<div id="campaigns" className="page">
			<Head>
				<title>Campaigns - {process.env.APP_NAME}</title>
			</Head>
			<Sidebar />
			<div id="page__content">
				<PageHeader title="Campaigns" primaryActionURL="/campaigns/create" primaryActionLabel="Create New Campaign" />
				<CampaignList />
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
