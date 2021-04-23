import { useEffect, useState } from "react";
import Refund from "./Refund";
import SubscriptionStatus from "./SubscriptionStatus";
import SubscriptionPlans from "./SubscriptionPlans";
import SubscriptionCancel from "./SubscriptionCancel";
import axios from "axios";

export default function Subscription() {
	const [currentPlan, setCurrentPlan] = useState(""); // @todo set based on user current plan
	const [currentPlanTerm, setCurrentPlanTerm] = useState("monthly"); // @todo set based on user current plan term
	const [planTerm, setPlanTerm] = useState("yearly"); // @todo set based on user current plan term
	const [paddle, setPaddle] = useState();

	const [requestCancelToken, setRequestCancelToken] = useState();

	useEffect(() => {
		if (window.Paddle) {
			window.Paddle.Environment.set("sandbox");
			window.Paddle.Setup({ vendor: 1866 });
			setPaddle(window.Paddle);
		}
	}, []);

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

		if (requestCancelToken) {
			requestCancelToken.cancel();
		}

		let source = axios.CancelToken.source();
		setRequestCancelToken(source);

		setCurrentPlan(plan);
		setCurrentPlanTerm(planTerm);

		paddle.Checkout.open({ product: 10825 });

		/* try {
			const updateResult = await axios.put(
				`/api/subscription/create`,
				{
					campaignId: campaign._id,
					url,
				},
				{
					headers: {
						"Content-Type": "application/json",
					},
				},
				{ cancelToken: source.token }
			);

			if (updateResult.data.success !== true) {
				setUpdateError(updateResult.data.errorMessage);
			} else {
				// add url to state
				updateCampaignDataInState("url", url);
			}
		} catch (error) {
			if (axios.isCancel(error)) {
				return;
			}
			console.log(error);
			setUpdateError("An error occurred. Please, try again.");
		} */
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
