import { useEffect, useState } from "react";
import { useSession } from "next-auth/client";
import Refund from "./Refund";
import SubscriptionStatus from "./SubscriptionStatus";
import SubscriptionPlans from "./SubscriptionPlans";
import SubscriptionCancel from "./SubscriptionCancel";
import axios from "axios";

export default function Subscription() {
	const [session] = useSession();
	const [currentPlan, setCurrentPlan] = useState(""); // @todo set based on user current plan
	const [currentPlanTerm, setCurrentPlanTerm] = useState("monthly"); // @todo set based on user current plan term
	const [planTerm, setPlanTerm] = useState("yearly"); // @todo set based on user current plan term
	const [paddle, setPaddle] = useState();

	const [requestCancelToken, setRequestCancelToken] = useState();

	useEffect(() => {
		if (window.Paddle) {
			if (process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT === "sandbox") {
				window.Paddle.Environment.set("sandbox");
			}
			window.Paddle.Setup({
				vendor: parseInt(process.env.NEXT_PUBLIC_PADDLE_VENDOR_ID),
				completeDetails: true,
				eventCallback: (data) => {
					switch (data.event) {
						case "Checkout.Complete":
							checkoutComplete(data.eventData);
							break;
						default:
							break;
					}
				},
			});
			setPaddle(window.Paddle);
		}
	}, []);

	const plans = {
		basic: {
			name: "Basic",
			productIdMonthly: process.env.NEXT_PUBLIC_BASIC_MONTLY_PRODUCT_ID,
			productIdYearly: process.env.NEXT_PUBLIC_BASIC_YEARLY_PRODUCT_ID,
			priceBilledMonthly: process.env.NEXT_PUBLIC_PRICE_BASIC_MONTHLY,
			priceBilledYearly: process.env.NEXT_PUBLIC_PRICE_BASIC_YEARLY,
			overagesCost: process.env.NEXT_PUBLIC_PRICE_BASIC_OVERAGES,
			limit: process.env.NEXT_PUBLIC_BASIC_LIMIT,
		},
		pro: {
			name: "Pro",
			productIdMonthly: process.env.NEXT_PUBLIC_PRO_MONTLY_PRODUCT_ID,
			productIdYearly: process.env.NEXT_PUBLIC_PRO_YEARLY_PRODUCT_ID,
			priceBilledMonthly: process.env.NEXT_PUBLIC_PRICE_PRO_MONTHLY,
			priceBilledYearly: process.env.NEXT_PUBLIC_PRICE_PRO_YEARLY,
			overagesCost: process.env.NEXT_PUBLIC_PRICE_PRO_OVERAGES,
			limit: process.env.NEXT_PUBLIC_PRO_LIMIT,
		},
		premium: {
			name: "Premium",
			productIdMonthly: process.env.NEXT_PUBLIC_PREMIUM_MONTLY_PRODUCT_ID,
			productIdYearly: process.env.NEXT_PUBLIC_PREMIUM_YEARLY_PRODUCT_ID,
			priceBilledMonthly: process.env.NEXT_PUBLIC_PRICE_PREMIUM_MONTHLY,
			priceBilledYearly: process.env.NEXT_PUBLIC_PRICE_PREMIUM_YEARLY,
			overagesCost: process.env.NEXT_PUBLIC_PRICE_PREMIUM_OVERAGES,
			limit: process.env.NEXT_PUBLIC_PREMIUM_LIMIT,
		},
	};

	const checkoutComplete = async (data) => {
		console.log(data);

		if (requestCancelToken) {
			requestCancelToken.cancel();
		}

		let source = axios.CancelToken.source();
		setRequestCancelToken(source);

		const { plan, planTerm } = JSON.parse(data.checkout.passthrough);

		try {
			const result = await axios.post(
				`/api/subscription/create`,
				{
					checkoutId: data.checkout.id,
					customerId: data.user.id,
					productId: data.product.id,
					plan: plan,
					planTerm: planTerm,
				},
				{
					headers: {
						"Content-Type": "application/json",
					},
				},
				{ cancelToken: source.token }
			);

			if (result.data.success !== true) {
				alert("An error occured, please refresh the page and try again");
			} else {
				setCurrentPlan(plan);
				setCurrentPlanTerm(planTerm);
			}
		} catch (error) {
			if (axios.isCancel(error)) {
				return;
			}
			console.log(error);
			alert("An error occurred. Please, try again.");
		}
	};

	const initiateCheckout = (productId, plan, planTerm) => {
		paddle.Checkout.open({
			product: productId,
			email: session.user.email || "",
			passthrough: JSON.stringify({ plan, planTerm }),
		});
	};

	return (
		<div>
			<h3 className="section-title">Subscription</h3>

			<SubscriptionStatus currentPlan={currentPlan} currentPlanTerm={currentPlanTerm} plans={plans} />

			<SubscriptionPlans planTerm={planTerm} setPlanTerm={setPlanTerm} currentPlan={currentPlan} plans={plans} currentPlanTerm={currentPlanTerm} initiateCheckout={initiateCheckout} />

			{currentPlan && <SubscriptionCancel currentPlan={currentPlan} />}

			<Refund />
		</div>
	);
}
