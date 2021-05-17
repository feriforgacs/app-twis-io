import Head from "next/head";
import { useSession, getSession } from "next-auth/client";
import Layout from "../../components/Layout";
import LoginForm from "../../components/LoginForm";
import Sidebar from "../../components/dashboard-components/Sidebar";
import ParticipantList from "../../components/dashboard-components/participant-components/ParticipantList";
import PageHeader from "../../components/dashboard-components/PageHeader";

export default function Participants() {
	const [session, loading] = useSession();

	if (typeof window !== "undefined" && loading) return null;

	if (!session) {
		return <LoginForm logInPage={true} accessDenied={true} />;
	}

	return (
		<Layout>
			<div id="participants" className="page">
				<Head>
					<title>Participants - {process.env.APP_NAME}</title>
				</Head>
				<Sidebar />
				<div id="page__content">
					<PageHeader title="Participants" />
					<ParticipantList />
				</div>
			</div>
		</Layout>
	);
}

export async function getServerSideProps(context) {
	const session = await getSession(context);
	return {
		props: { session },
	};
}
