/**
 * @todo loading state
 * @todo get users current plan from the backend
 */
import Head from "next/head";
import { useSession, getSession } from "next-auth/client";
import LoginForm from "../../components/LoginForm";
import Sidebar from "../../components/dashboard-components/Sidebar";
import PageHeader from "../../components/dashboard-components/PageHeader";
import PersonalSettings from "../../components/dashboard-components/account-components/PersonalSettings";
import Subscription from "../../components/dashboard-components/account-components/Subscription";
import AccountDelete from "../../components/dashboard-components/account-components/AccountDelete";

export default function AccountPage() {
	const [session, loading] = useSession();

	if (typeof window !== "undefined" && loading) return null;

	if (!session) {
		return <LoginForm signInPage={true} accessDenied={true} />;
	}

	return (
		<div id="account" className="page">
			<Head>
				<title>Account - {process.env.APP_NAME}</title>
			</Head>
			<Sidebar />
			<div id="page__content">
				<PageHeader title="Account" />
				<PersonalSettings />
				<Subscription />
				<AccountDelete />
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
