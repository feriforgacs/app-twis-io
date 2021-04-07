import { useState, useEffect } from "react";
import { format } from "date-fns";
import Toast from "../Toast";
import Refund from "./Refund";
import SubscriptionPlans from "./SubscriptionPlans";
import SubscriptionCancel from "./SubscriptionCancel";

export default function Subscription() {
	const [loading, setLoading] = useState(false);
	const [currentUsage, setCurrentUsage] = useState({ limit: 0, value: 0, renewDate: Date.now() });

	const [toastMessage, setToastMessage] = useState(false);
	const [toastVisible, setToastVisible] = useState(false);
	const [toastType, setToastType] = useState("default");
	const [toastDuration, setToastDuration] = useState(3000);

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

	useEffect(() => {
		const getUsage = async () => {
			try {
				const usageDataRequest = await fetch(`/api/account/usage`, {
					method: "GET",
				});

				const usageData = await usageDataRequest.json();

				setLoading(false);

				if (usageData.success !== true) {
					// error
					setLoading(false);
					// error
					setToastMessage("Can't get usage information.");
					setToastType("error");
					setToastDuration(6000);
					setToastVisible(true);
					return;
				}

				if (usageData.data) {
					setCurrentUsage(usageData.data);
				}
			} catch (error) {
				console.log(error);
				setLoading(false);
				// error
				setToastMessage("Can't get usage information.");
				setToastType("error");
				setToastDuration(6000);
				setToastVisible(true);
			}

			return;
		};

		getUsage();
	}, []);

	return (
		<div>
			<h3 className="section-title">Subscription</h3>

			{loading ? (
				"loading..."
			) : (
				<div className="user-subscription">
					<div className="user-subscription__plan">
						<p>
							Your current plan: <strong>{currentPlan ? `${plans[currentPlan].name} - ${currentPlanTerm}` : "You are not subscribed to any of the plans at the moment"}</strong>
						</p>
					</div>
					<div className="user-subscription__usage">
						<p>
							Usage limit: <strong>{currentPlan ? `` : `You can collect 10 unique participants until ${format(new Date(currentUsage.renewDate), "yyy.MM.dd.")}`}</strong>
						</p>
						<p>
							Usage status: <strong>{currentPlan ? `` : `${currentUsage.value} / 10`}</strong>
						</p>
						{currentPlan && (
							<p>
								Plan renew date: <strong>{format(new Date(currentUsage.renewDate), "yyy.MM.dd.")}</strong>
							</p>
						)}
						{currentPlan && currentUsage.value > currentUsage.limit && <p>Overages cost: TODO</p>}
					</div>
					<div className="user-subscription__renew-date"></div>
				</div>
			)}

			<SubscriptionPlans planTerm={planTerm} setPlanTerm={setPlanTerm} currentPlan={currentPlan} plans={plans} currentPlanTerm={currentPlanTerm} setSubscription={setSubscription} />

			{currentPlan && <SubscriptionCancel currentPlan={currentPlan} />}

			<Refund />

			{toastVisible && <Toast onClose={() => setToastVisible(false)} duration={toastDuration} type={toastType} content={toastMessage} />}
		</div>
	);
}
