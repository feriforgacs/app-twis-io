import Head from "next/head";
import { useRouter } from "next/router";
import { useSession, getSession } from "next-auth/client";
import LoginForm from "../../../components/LoginForm";
import Sidebar from "../../../components/dashboard-components/Sidebar";
import ParticipantList from "../../../components/dashboard-components/participant-components/ParticipantList";

export default function campaignParticipants() {
	const router = useRouter();
	const [session, loading] = useSession();

	if (typeof window !== "undefined" && loading) return null;

	if (!session) {
		return <LoginForm signInPage={true} accessDenied={true} />;
	}

	return (
		<div id="participants" className="page">
			<Head>
				<title>Participants - {process.env.APP_NAME}</title>
			</Head>
			<Sidebar />
			<div id="page__content">
				<header id="page__header">
					<h1 className="page__title">###CAMPAING NAME / Participants</h1>
				</header>

				<ParticipantList campaignId={router.query.id} hideCampaignSelect={true} />
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
