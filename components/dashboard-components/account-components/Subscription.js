import { useState, useEffect } from "react";
import { useSession } from "next-auth/client";
import Refund from "./Refund";
import SubscriptionStatus from "./SubscriptionStatus";
import SubscriptionPlans from "./SubscriptionPlans";
import SubscriptionCancel from "./SubscriptionCancel";
import axios from "axios";
import Plans from "../../../utils/SubscriptionPlans";

export default function Subscription() {
	const [session] = useSession();
	const [currentPlan, setCurrentPlan] = useState("");
	const [currentPlanTerm, setCurrentPlanTerm] = useState("monthly");
	const [planTerm, setPlanTerm] = useState("yearly");

	const [requestCancelToken, setRequestCancelToken] = useState();

	let Paddle = null;
	if (typeof window !== "undefined" && window.Paddle) {
		/**
		 * Initiate paddle
		 */
		Paddle = window.Paddle;

		// set environment
		if (process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT === "sandbox") {
			Paddle.Environment.set("sandbox");
		}

		Paddle.Setup({
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
	}

	useEffect(() => {
		let source;

		const getSubscriptionData = async () => {
			/**
			 * @todo get subscription data from the db
			 */
			let source = axios.CancelToken.source();

			try {
				const subscription = await axios.get(
					`/api/subscription/data`,
					{
						headers: {
							"Content-Type": "application/json",
						},
					},
					{ cancelToken: source.token }
				);

				if (subscription.data.success !== true) {
					alert("An error occured, please refresh the page and try again");
				}
			} catch (error) {
				if (axios.isCancel(error)) {
					return;
				}
				console.log(error);
				alert("An error occurred. Please, try again.");
			}
		};

		getSubscriptionData();

		return () => {
			source.cancel();
		};
	}, []);

	const checkoutComplete = async (data) => {
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
					subscriptionId: data.order.subscription_id,
					orderId: data.order.order_id,
					plan,
					planTerm,
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
		Paddle.Checkout.open({
			product: productId,
			email: session.user.email || "",
			passthrough: JSON.stringify({ plan, planTerm }),
		});
	};

	return (
		<div>
			<h3 className="section-title">Subscription</h3>

			<SubscriptionStatus currentPlan={currentPlan} currentPlanTerm={currentPlanTerm} plans={Plans} />

			<SubscriptionPlans planTerm={planTerm} setPlanTerm={setPlanTerm} currentPlan={currentPlan} plans={Plans} currentPlanTerm={currentPlanTerm} initiateCheckout={initiateCheckout} />

			{currentPlan && <SubscriptionCancel currentPlan={currentPlan} />}

			<Refund />
		</div>
	);
}
