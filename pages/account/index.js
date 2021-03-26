import { useState } from "react";
import Head from "next/head";
import { useSession, getSession } from "next-auth/client";
import LoginForm from "../../components/LoginForm";
import Sidebar from "../../components/dashboard-components/Sidebar";
import PageHeader from "../../components/dashboard-components/PageHeader";

export default function AccountPage() {
	const [session, loading] = useSession();
	const [currentPlan, setCurrentPlan] = useState("");
	const planNames = {
		basic: "Basic",
		pro: "Pro",
		premium: "Premium",
	};

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
					<p>
						Your current plan: <strong>{currentPlan ? planNames[currentPlan] : "You are not subscribed to any of the plans at the moment"}</strong>
					</p>

					<div className="subscription__options">
						<div className={`subscription-option ${currentPlan && currentPlan === "basic" ? "subscription-option--current" : ""}`}>
							<h4>Basic</h4>
							<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum, dicta.</p>
							{currentPlan && currentPlan === "basic" && (
								<p className="current-plan">
									<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5a38fd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
										<polyline points="9 11 12 14 22 4"></polyline>
										<path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
									</svg>

									<span>Current plan</span>
								</p>
							)}

							{!currentPlan && <button className="button button--primary">Upgrade to this plan</button>}

							{currentPlan && currentPlan !== "basic" ? <button className="button button--outline button--downgrade">Downgrade to this plan</button> : ""}
						</div>

						<div className={`subscription-option ${currentPlan && currentPlan === "pro" ? "subscription-option--current" : ""}`}>
							<h4>Pro</h4>
							<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum, dicta.</p>
							{currentPlan && currentPlan === "pro" && (
								<p className="current-plan">
									<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5a38fd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
										<polyline points="9 11 12 14 22 4"></polyline>
										<path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
									</svg>

									<span>Current plan</span>
								</p>
							)}

							{(!currentPlan || (currentPlan && currentPlan === "basic")) && <button className="button button--primary">Upgrade to this plan</button>}

							{currentPlan && currentPlan === "premium" ? <button className="button button--outline button--downgrade">Downgrade to this plan</button> : ""}
						</div>

						<div className={`subscription-option ${currentPlan && currentPlan === "premium" ? "subscription-option--current" : ""}`}>
							<h4>Premium</h4>
							<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum, dicta.</p>
							{currentPlan && currentPlan === "premium" ? (
								<p className="current-plan">
									<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5a38fd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
										<polyline points="9 11 12 14 22 4"></polyline>
										<path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
									</svg>

									<span>Current plan</span>
								</p>
							) : (
								<button className="button button--primary">Upgrade to this plan</button>
							)}
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
