export default function SubscriptionPlans({ planTerm, setPlanTerm, currentPlan, plans, currentPlanTerm, initiateCheckout }) {
	return (
		<>
			<div className="subscription__terms">
				<span className={`term ${planTerm === "monthly" ? "term--active" : ""}`} onClick={() => setPlanTerm("monthly")}>
					Billed monthly
				</span>
				<span className={`term ${planTerm === "yearly" ? "term--active" : ""}`} onClick={() => setPlanTerm("yearly")}>
					Billed annually
					<small> -20%</small>
				</span>
			</div>
			<div className="subscription__options">
				<div className={`subscription-option ${currentPlan && currentPlan === "basic" && planTerm === currentPlanTerm ? "subscription-option--current" : ""}`}>
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
					<p className="plan-term-info">{planTerm === "monthly" ? "Billed monthly" : "Billed annually"}, VAT not included</p>
					<ul>
						<li>All features included</li>
						<li>Unlimited campaigns</li>
						<li>
							<strong>{plans.basic.limit} participants / month</strong>
							<br />
							<small>${plans.basic.overagesPrice} per additional participant</small>
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
						<button
							className="button button--primary"
							onClick={() => {
								const productId = planTerm === "monthly" ? plans.basic.productIdMonthly : plans.basic.productIdYearly;
								initiateCheckout(productId, "basic", planTerm);
							}}
						>
							Choose to this plan
						</button>
					)}
				</div>

				<div className={`subscription-option ${currentPlan && currentPlan === "pro" && planTerm === currentPlanTerm ? "subscription-option--current" : ""}`}>
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
					<p className="plan-term-info">{planTerm === "monthly" ? "Billed monthly" : "Billed annually"}, VAT not included</p>
					<ul>
						<li>All features included</li>
						<li>Unlimited campaigns</li>
						<li>
							<strong>{plans.pro.limit} participants / month</strong>
							<br />
							<small>${plans.pro.overagesPrice} per additional participant</small>
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
						<button
							className="button button--primary"
							onClick={() => {
								const productId = planTerm === "monthly" ? plans.pro.productIdMonthly : plans.pro.productIdYearly;
								initiateCheckout(productId, "pro", planTerm);
							}}
						>
							Choose to this plan
						</button>
					)}
				</div>

				<div className={`subscription-option ${currentPlan && currentPlan === "premium" && planTerm === currentPlanTerm ? "subscription-option--current" : ""}`}>
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
					<p className="plan-term-info">{planTerm === "monthly" ? "Billed monthly" : "Billed annually"}, VAT not included</p>
					<ul>
						<li>All features included</li>
						<li>Unlimited campaigns</li>
						<li>
							<strong>{plans.premium.limit} participants / month</strong>
							<br />
							<small>${plans.premium.overagesPrice} per additional participant</small>
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
						<button
							className="button button--primary"
							onClick={() => {
								const productId = planTerm === "monthly" ? plans.premium.productIdMonthly : plans.premium.productIdYearly;
								initiateCheckout(productId, "premium", planTerm);
							}}
						>
							Choose to this plan
						</button>
					)}
				</div>
			</div>
		</>
	);
}
