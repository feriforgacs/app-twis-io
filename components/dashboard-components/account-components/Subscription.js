import { useState } from "react";
import Modal from "../Modal";

export default function Subscription() {
	const [cancelModalVisible, setCancelModalVisible] = useState(false);
	const [cancelLoading, setCancelLoading] = useState(false);
	const [currentPlan, setCurrentPlan] = useState("");
	const [currentPlanTerm, setCurrentPlanTerm] = useState("monthly"); // @todo set based on user current plan term
	const [planTerm, setPlanTerm] = useState("yearly"); // @todo set based on user current plan term
	const plans = {
		basic: {
			name: "Basic",
			priceBilledMonthly: 29,
			priceBilledYearly: 24,
		},
		pro: {
			name: "Pro",
			priceBilledMonthly: 49,
			priceBilledYearly: 40,
		},
		premium: {
			name: "Premium",
			priceBilledMonthly: 69,
			priceBilledYearly: 57,
		},
	};

	const setSubscription = async (plan) => {
		/**
		 * @todo send request to backend
		 * @todo display loading state
		 * @todo display result
		 * @todo update current plan in state
		 */
		setCurrentPlan(plan);
		setCurrentPlanTerm(planTerm);
	};

	const cancelSubscription = () => {
		/**
		 * @todo send cancel request to backend
		 * @todo display loading state
		 * @todo display result
		 * @todo update current plan in state
		 */
		setCancelLoading(true);
	};

	return (
		<div>
			<h3 className="section-title">Subscription</h3>
			<p>
				Your current plan: <strong>{currentPlan ? `${plans[currentPlan].name} - ${currentPlanTerm}` : "You are not subscribed to any of the plans at the moment"}</strong>
			</p>

			<div className="subscription__terms">
				<span className={`term ${planTerm === "yearly" ? "term--active" : ""}`} onClick={() => setPlanTerm("yearly")}>
					Bill yearly
					<br />
					<small>2 months free</small>
				</span>
				<span className={`term ${planTerm === "monthly" ? "term--active" : ""}`} onClick={() => setPlanTerm("monthly")}>
					Bill monthly
				</span>
			</div>

			<div className="subscription__options">
				<div className={`subscription-option ${currentPlan && currentPlan === "basic" ? "subscription-option--current" : ""}`}>
					<h4>
						<span role="img" aria-label="thumbs up">
							👍
						</span>
						Basic
					</h4>
					<p className="subscription-option__price">
						<span>${planTerm === "monthly" ? plans.basic.priceBilledMonthly : plans.basic.priceBilledYearly}</span>
						<small> / month</small>
					</p>
					<p className="plan-term-info">{planTerm === "monthly" ? "Billed monthly" : "Billed yearly"}, VAT not included</p>
					<ul>
						<li>All features included</li>
						<li>Unlimited campaigns</li>
						<li>
							<strong>100 unique participants / month</strong>
						</li>
					</ul>
					{currentPlan && currentPlan === "basic" && planTerm === currentPlanTerm && (
						<p className="current-plan">
							<span className="icon">
								<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
									<polyline points="20 6 9 17 4 12"></polyline>
								</svg>
							</span>

							<span>Your current plan</span>
						</p>
					)}

					{(!currentPlan || currentPlan !== "basic" || planTerm !== currentPlanTerm) && (
						<button className="button button--primary" onClick={() => setSubscription("basic")}>
							Choose to this plan
						</button>
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
						<span>${planTerm === "monthly" ? plans.pro.priceBilledMonthly : plans.pro.priceBilledYearly}</span>
						<small> / month</small>
					</p>
					<p className="plan-term-info">{planTerm === "monthly" ? "Billed monthly" : "Billed yearly"}, VAT not included</p>
					<ul>
						<li>All features included</li>
						<li>Unlimited campaigns</li>
						<li>
							<strong>1.000 unique participants / month</strong>
						</li>
					</ul>
					{currentPlan && currentPlan === "pro" && planTerm === currentPlanTerm && (
						<p className="current-plan">
							<span className="icon">
								<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
									<polyline points="20 6 9 17 4 12"></polyline>
								</svg>
							</span>

							<span>Your current plan</span>
						</p>
					)}

					{(!currentPlan || currentPlan !== "pro" || planTerm !== currentPlanTerm) && (
						<button className="button button--primary" onClick={() => setSubscription("pro")}>
							Choose to this plan
						</button>
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
						<span>${planTerm === "monthly" ? plans.premium.priceBilledMonthly : plans.premium.priceBilledYearly}</span>
						<small> / month</small>
					</p>
					<p className="plan-term-info">{planTerm === "monthly" ? "Billed monthly" : "Billed yearly"}, VAT not included</p>
					<ul>
						<li>All features included</li>
						<li>Unlimited campaigns</li>
						<li>
							<strong>10.000 unique participants / month</strong>
						</li>
					</ul>
					{currentPlan && currentPlan === "premium" && planTerm === currentPlanTerm && (
						<p className="current-plan">
							<span className="icon">
								<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
									<polyline points="20 6 9 17 4 12"></polyline>
								</svg>
							</span>

							<span>Your current plan</span>
						</p>
					)}

					{(!currentPlan || currentPlan !== "premium" || planTerm !== currentPlanTerm) && (
						<button className="button button--primary" onClick={() => setSubscription("premium")}>
							Choose to this plan
						</button>
					)}
				</div>
			</div>

			{currentPlan ? (
				<div className="subscription__cancel">
					<h4>Cancel subscription</h4>
					<p>You can cancel your subscription any time by clicking the button below. The collected participant information and the campaigns you created won&apos;t be affected.</p>
					{currentPlan && currentPlan !== "basic" && <p>If your current subscription is not the best option for you, you can also dowgrade your account to a smaller plan.</p>}
					<button className="button button--outline button--slim" onClick={() => setCancelModalVisible(true)}>
						Cancel subscription
					</button>

					{cancelModalVisible && <Modal title="Are you sure you want to cancel your subscription?" body="This won't affect the campaigns your created and the collected participant information" primaryAction={cancelSubscription} primaryActionLabel="Yes, cancel subscription" secondaryAction={() => setCancelModalVisible(false)} secondaryActionLabel="Keep subscription" onClose={() => setCancelModalVisible(false)} loading={cancelLoading} />}
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
	);
}
