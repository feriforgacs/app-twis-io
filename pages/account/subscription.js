import Head from "next/head";
import { useSession, getSession } from "next-auth/client";
import LoginForm from "../../components/LoginForm";
import Sidebar from "../../components/dashboard-components/Sidebar";
import PageHeader from "../../components/dashboard-components/PageHeader";

export default function SubscriptionPage() {
	const [session, loading] = useSession();

	if (typeof window !== "undefined" && loading) return null;

	if (!session) {
		return <LoginForm signInPage={true} accessDenied={true} />;
	}

	return (
		<div id="account" className="page">
			<Head>
				<title>Account - {process.env.APP_NAME}</title>
				<script src="https://cdn.paddle.com/paddle/paddle.js"></script>
			</Head>
			<Sidebar />
			<div id="page__content">
				<PageHeader title="Account - Subscription" />
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
