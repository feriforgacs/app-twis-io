import Head from "next/head";
import { useSession, getSession } from "next-auth/client";
import LoginForm from "../../components/LoginForm";
import Sidebar from "../../components/dashboard-components/Sidebar";
import CampaignCreate from "../../components/dashboard-components/campaign-components/CampaignCreate";

export default function campaigns() {
	const [session, loading] = useSession();

	if (typeof window !== "undefined" && loading) return null;

	if (!session) {
		return <LoginForm signInPage={true} accessDenied={true} />;
	}

	return (
		<div id="campaigns" className="page">
			<Head>
				<title>Create New Campaign - {process.env.APP_NAME}</title>
			</Head>
			<Sidebar />
			<div id="page__content">
				<header id="page__header">
					<h1 className="page__title">Create New Campaign</h1>
				</header>

				<CampaignCreate />
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
