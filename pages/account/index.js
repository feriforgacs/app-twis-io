/**
 * @todo display prices
 * @todo loading state
 * @todo get users current plan from the backend
 */
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

	const upgradeSubscription = async (plan) => {
		/**
		 * @todo send request to backend
		 * @todo display loading state
		 * @todo display result
		 * @todo update current plan in state
		 */
		setCurrentPlan(plan);
	};

	const downgradeSubscription = async (plan) => {
		/**
		 * @todo send request to backend
		 * @todo display loading state
		 * @todo display result
		 * @todo update current plan in state
		 */
		setCurrentPlan(plan);
	};

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
							<h4>
								<span role="img" aria-label="thumbs up">
									👍
								</span>
								Basic
							</h4>
							<p className="subscription-option__price">
								<span>$29</span>
								<small> / month</small>
							</p>
							<ul>
								<li>All features included</li>
								<li>Unlimited campaigns</li>
								<li>
									<strong>100 unique participants / month</strong>
								</li>
							</ul>
							{currentPlan && currentPlan === "basic" && (
								<p className="current-plan">
									<span className="icon">
										<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
											<polyline points="20 6 9 17 4 12"></polyline>
										</svg>
									</span>

									<span>Your current plan</span>
								</p>
							)}

							{!currentPlan && (
								<button className="button button--primary" onClick={() => upgradeSubscription("basic")}>
									Upgrade to this plan
								</button>
							)}

							{currentPlan && currentPlan !== "basic" ? (
								<button className="button button--outline button--downgrade" onClick={() => downgradeSubscription("basic")}>
									Downgrade to this plan
								</button>
							) : (
								""
							)}
						</div>

						<div className={`subscription-option ${currentPlan && currentPlan === "pro" ? "subscription-option--current" : ""}`}>
							<h4>
								<span role="img" aria-label="thumbs up">
									⭐
								</span>
								Pro
							</h4>
							<p className="subscription-option__price">
								<span>$49</span>
								<small> / month</small>
							</p>
							<ul>
								<li>All features included</li>
								<li>Unlimited campaigns</li>
								<li>
									<strong>1.000 unique participants / month</strong>
								</li>
							</ul>
							{currentPlan && currentPlan === "pro" && (
								<p className="current-plan">
									<span className="icon">
										<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
											<polyline points="20 6 9 17 4 12"></polyline>
										</svg>
									</span>

									<span>Your current plan</span>
								</p>
							)}

							{(!currentPlan || (currentPlan && currentPlan === "basic")) && (
								<button className="button button--primary" onClick={() => upgradeSubscription("pro")}>
									Upgrade to this plan
								</button>
							)}

							{currentPlan && currentPlan === "premium" ? (
								<button className="button button--outline button--downgrade" onClick={() => downgradeSubscription("pro")}>
									Downgrade to this plan
								</button>
							) : (
								""
							)}
						</div>

						<div className={`subscription-option ${currentPlan && currentPlan === "premium" ? "subscription-option--current" : ""}`}>
							<h4>
								<span role="img" aria-label="thumbs up">
									🚀
								</span>
								Premium
							</h4>
							<p className="subscription-option__price">
								<span>$69</span>
								<small> / month</small>
							</p>
							<ul>
								<li>All features included</li>
								<li>Unlimited campaigns</li>
								<li>
									<strong>10.000 unique participants / month</strong>
								</li>
							</ul>
							{currentPlan && currentPlan === "premium" ? (
								<p className="current-plan">
									<span className="icon">
										<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
											<polyline points="20 6 9 17 4 12"></polyline>
										</svg>
									</span>

									<span>Your current plan</span>
								</p>
							) : (
								<button className="button button--primary" onClick={() => upgradeSubscription("premium")}>
									Upgrade to this plan
								</button>
							)}
						</div>
					</div>

					{currentPlan ? (
						<div className="subscription__cancel">
							<h4>Cancel subscription</h4>
							<p>You can cancel your subscription any time by clicking the button below. The collected participant information and the campaigns you created won&apos;t be affected.</p>
							{currentPlan && currentPlan !== "basic" && <p>If your current subscription is not the best option for you, you can also dowgrade your account to a smaller plan.</p>}
							<button className="button button--outline button--slim">Cancel subscription</button>
						</div>
					) : (
						""
					)}

					<div className="subscription__refund">
						<h4>Refund</h4>
						<p>
							If you&apos;d like to initiate a refund, please send us a message to{" "}
							<a href="mailto:refund@twis.io" target="_blank" rel="noopener noreferrer">
								refund@twis.io
							</a>{" "}
							from the email address you used to create your account.
						</p>
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
