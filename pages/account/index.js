import Head from "next/head";
import { useSession, getSession } from "next-auth/client";
import LoginForm from "../../components/LoginForm";
import Sidebar from "../../components/dashboard-components/Sidebar";
import PageHeader from "../../components/dashboard-components/PageHeader";

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

				<div>
					<h3>Subscription</h3>
					<p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Veritatis, autem.</p>

					<div className="subscription__options">
						<div className="subscription-option">
							<h3>Basic</h3>
							<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum, dicta.</p>
							<button>Upgrade to this plan</button>
							<button>Downgrade to this plan</button>
						</div>

						<div className="subscription-option">
							<h3>Pro</h3>
							<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum, dicta.</p>
							<button>Upgrade to this plan</button>
							<button>Downgrade to this plan</button>
						</div>

						<div className="subscription-option">
							<h3>Premium</h3>
							<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum, dicta.</p>
							<button>Upgrade to this plan</button>
							<button>Downgrade to this plan</button>
						</div>
					</div>

					<div>
						<h4>Cancel subscription</h4>
						<p>You can cancel your subscription any time by clicking the button below. The collected participant information and the campaigns you created won&apos;t be affected.</p>
						<p>If your current subscription is not the best option for you, you can also dowgrade your account to a smaller plan.</p>
						<button>Cancel subscription</button>
					</div>
				</div>
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
