import { useState } from "react";
import Refund from "./Refund";
import SubscriptionStatus from "./SubscriptionStatus";
import SubscriptionPlans from "./SubscriptionPlans";
import SubscriptionCancel from "./SubscriptionCancel";

export default function Subscription() {
	const [currentPlan, setCurrentPlan] = useState(""); // @todo set based on user current plan
	const [currentPlanTerm, setCurrentPlanTerm] = useState("monthly"); // @todo set based on user current plan term
	const [planTerm, setPlanTerm] = useState("yearly"); // @todo set based on user current plan term

	const plans = {
		basic: {
			name: "Basic",
			priceBilledMonthly: process.env.NEXT_PUBLIC_PRICE_BASIC_MONTHLY,
			priceBilledYearly: process.env.NEXT_PUBLIC_PRICE_BASIC_YEARLY,
			overagesCost: process.env.NEXT_PUBLIC_PRICE_BASIC_OVERAGES,
			limit: process.env.NEXT_PUBLIC_BASIC_LIMIT,
		},
		pro: {
			name: "Pro",
			priceBilledMonthly: process.env.NEXT_PUBLIC_PRICE_PRO_MONTHLY,
			priceBilledYearly: process.env.NEXT_PUBLIC_PRICE_PRO_YEARLY,
			overagesCost: process.env.NEXT_PUBLIC_PRICE_PRO_OVERAGES,
			limit: process.env.NEXT_PUBLIC_PRO_LIMIT,
		},
		premium: {
			name: "Premium",
			priceBilledMonthly: process.env.NEXT_PUBLIC_PRICE_PREMIUM_MONTHLY,
			priceBilledYearly: process.env.NEXT_PUBLIC_PRICE_PREMIUM_YEARLY,
			overagesCost: process.env.NEXT_PUBLIC_PRICE_PREMIUM_OVERAGES,
			limit: process.env.NEXT_PUBLIC_PREMIUM_LIMIT,
		},
	};

	const setSubscription = async (plan) => {
		/**
		 * @todo send request to backend
		 * @todo display loading state
		 * @todo display result
		 * @todo update current plan in state
		 * @todo update usage limits and dates
		 */
		setCurrentPlan(plan);
		setCurrentPlanTerm(planTerm);
	};

	return (
		<div>
			<h3 className="section-title">Subscription</h3>

			<SubscriptionStatus currentPlan={currentPlan} currentPlanTerm={currentPlanTerm} plans={plans} />

			<SubscriptionPlans planTerm={planTerm} setPlanTerm={setPlanTerm} currentPlan={currentPlan} plans={plans} currentPlanTerm={currentPlanTerm} setSubscription={setSubscription} />

			{currentPlan && <SubscriptionCancel currentPlan={currentPlan} />}

			<Refund />
		</div>
	);
}
