import Head from "next/head";
import { useSession, getSession } from "next-auth/client";
import Layout from "../../components/Layout";
import LoginForm from "../../components/LoginForm";
import Sidebar from "../../components/dashboard-components/Sidebar";
import PageTabNavigation from "../../components/dashboard-components/PageTabNavigation";
import Subscription from "../../components/dashboard-components/account-components/Subscription";
import { accountPageTabs } from "./index";

export default function SubscriptionPage() {
	const [session, loading] = useSession();

	if (typeof window !== "undefined" && loading) return null;

	if (!session) {
		return <LoginForm logInPage={true} accessDenied={true} />;
	}

	return (
		<Layout>
			<div id="account" className="page">
				<Head>
					<title>Subscription - Account - {process.env.APP_NAME}</title>
				</Head>
				<Sidebar />
				<div id="page__content">
					<PageTabNavigation tabs={accountPageTabs} activeTabSlug="/account/subscription" />
					<Subscription />
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
