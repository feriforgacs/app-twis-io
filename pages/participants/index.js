import Head from "next/head";
import Link from "next/link";
import { useSession, getSession } from "next-auth/client";
import LoginForm from "../../components/LoginForm";
import Sidebar from "../../components/dashboard-components/Sidebar";
import ParticipantList from "../../components/dashboard-components/participant-components/ParticipantList";

export default function participants() {
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
					<h1 className="page__title">Participants</h1>
				</header>

				<ParticipantList />
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
