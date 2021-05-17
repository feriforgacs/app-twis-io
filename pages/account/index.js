import Head from "next/head";
import { useSession, getSession } from "next-auth/client";
import Layout from "../../components/Layout";
import LoginForm from "../../components/LoginForm";
import Sidebar from "../../components/dashboard-components/Sidebar";
import PersonalSettings from "../../components/dashboard-components/account-components/PersonalSettings";
import AccountDelete from "../../components/dashboard-components/account-components/AccountDelete";
import PageTabNavigation from "../../components/dashboard-components/PageTabNavigation";

export const accountPageTabs = [
	{ slug: "/account", label: "Personal settings" },
	{ slug: "/account/subscription", label: "Subscription" },
];

export default function AccountPage() {
	const [session, loading] = useSession();

	if (typeof window !== "undefined" && loading) return null;

	if (!session) {
		return <LoginForm logInPage={true} accessDenied={true} />;
	}

	return (
		<Layout>
			<div id="account" className="page">
				<Head>
					<title>Personal settings - Account - {process.env.APP_NAME}</title>
				</Head>
				<Sidebar />
				<div id="page__content">
					<PageTabNavigation tabs={accountPageTabs} activeTabSlug="/account" />
					<PersonalSettings />
					<AccountDelete />
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
