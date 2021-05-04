/**
 * @todo display loading state
 */
import { useState, useEffect } from "react";
import { useSession } from "next-auth/client";
import Refund from "./Refund";
import SubscriptionStatus from "./SubscriptionStatus";
import SubscriptionPlans from "./SubscriptionPlans";
import SubscriptionCancel from "./SubscriptionCancel";
import axios from "axios";
import Plans from "../../../utils/SubscriptionPlans";
import Modal from "../Modal";
import Toast from "../Toast";

export default function Subscription() {
	const [session] = useSession();
	const [activeSubscription, setActiveSubscription] = useState();
	const [currentPlan, setCurrentPlan] = useState("");
	const [currentPlanTerm, setCurrentPlanTerm] = useState("monthly");
	const [planTerm, setPlanTerm] = useState("monthly");
	const [cancelLoading, setCancelLoading] = useState(false);
	const [requestCancelToken, setRequestCancelToken] = useState();
	const [cancelRequestCancelToken, setCancelRequestCancelToken] = useState();

	const [modalVisible, setModalVisible] = useState(false);
	const [modalTitle, setModalTitle] = useState();
	const [modalBody, setModalBody] = useState();

	const [updateModalVisible, setUpdateModalVisible] = useState(false);
	const [updateLoading, setUpdateLoading] = useState(false);
	const [updateSettings, setUpdateSettings] = useState({ productId: "", plan: "", planTerm: "" });

	const [toastMessage, setToastMessage] = useState(false);
	const [toastVisible, setToastVisible] = useState(false);
	const [toastType, setToastType] = useState("default");
	const [toastDuration, setToastDuration] = useState(3000);

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
			// completeDetails: true,
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
		/**
		 * Get subscription data from the database
		 */
		const getSubscriptionData = async () => {
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
					return;
				}

				if (subscription.data.subscription !== null) {
					setCurrentPlan(subscription.data.subscription.plan);
					setCurrentPlanTerm(subscription.data.subscription.planTerm);
					setActiveSubscription(subscription.data.subscription);
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
	}, []);

	/**
	 * Save subscription data to the db
	 * @param {obj} data Subscription result object
	 */
	const checkoutComplete = (data) => {
		if (requestCancelToken) {
			requestCancelToken.cancel();
		}

		let source = axios.CancelToken.source();
		setRequestCancelToken(source);

		const { plan, planTerm } = JSON.parse(data.checkout.passthrough);

		Paddle.Order.details(data.checkout.id, async (orderDetails) => {
			try {
				const result = await axios.post(
					`/api/subscription/create`,
					{
						checkoutId: data.checkout.id,
						customerId: data.user.id,
						productId: data.product.id,
						subscriptionId: orderDetails.order.subscription_id,
						orderId: orderDetails.order.order_id,
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
					setActiveSubscription(result.data.subscription);
				}
			} catch (error) {
				if (axios.isCancel(error)) {
					return;
				}
				console.log(error);
				alert("An error occurred. Please, try again.");
			}
		});
		return;
	};

	/**
	 * Init Paddle checkout with the selected subscription
	 * Or upgrade / downgrade subscription
	 * @param {int} productId Selected subscription id
	 * @param {string} plan Selected plan (basic, pro, premium)
	 * @param {string} planTerm Selected plan term (monthly, yearly)
	 */
	const initiateCheckout = (productId, plan, planTerm) => {
		if (activeSubscription) {
			// An active subscription already exists, upgrade / downgrade subscription
			setUpdateSettings({ productId, plan, planTerm });
			setModalTitle("Change subscription");
			setModalBody("Are you sure you'd like to change your existing subscription?");
			setUpdateModalVisible(true);
		} else {
			// Initiate checkout to create new subscription
			Paddle.Checkout.open({
				product: productId,
				email: session.user.email || "",
				passthrough: JSON.stringify({ plan, planTerm }),
			});
		}
	};

	/**
	 * Cancel subscription
	 */
	const cancelSubscription = async () => {
		setCancelLoading(true);

		if (cancelRequestCancelToken) {
			cancelRequestCancelToken.cancel();
		}

		let source = axios.CancelToken.source();
		setCancelRequestCancelToken(source);

		try {
			const subscription = await axios.post(
				`/api/subscription/cancel`,
				{
					subscriptionId: activeSubscription.subscriptionId,
				},
				{
					headers: {
						"Content-Type": "application/json",
					},
				},
				{ cancelToken: source.token }
			);

			setCancelLoading(false);

			if (subscription.data.success !== true) {
				setModalTitle("Error");
				setModalBody("An error occured. Please, wait a few minutes and try again. If the problem persist, please get in touch with us.");
				setModalVisible(true);
				return;
			}

			setCurrentPlan("");
			setCurrentPlanTerm("");
			setActiveSubscription(null);
			setModalTitle("Success");
			setModalBody("Your subscription has been cancelled.");
			setModalVisible(true);
		} catch (error) {
			if (axios.isCancel(error)) {
				return;
			}
			console.log(error);
			setCancelLoading(false);
			setModalTitle("Error");
			setModalBody("An error occured. Please, wait a few minutes and try again. If the problem persist, please get in touch with us.");
			setModalVisible(true);
		}
	};

	/**
	 * Update an existing subscription
	 */
	const updateSubscription = async () => {
		setUpdateLoading(true);

		if (requestCancelToken) {
			requestCancelToken.cancel();
		}

		let source = axios.CancelToken.source();
		setRequestCancelToken(source);

		try {
			const result = await axios.post(
				`/api/subscription/update`,
				{
					productId: updateSettings.productId,
					subscriptionId: activeSubscription.subscriptionId,
					plan: updateSettings.plan,
					planTerm: updateSettings.planTerm,
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
				setCurrentPlan(updateSettings.plan);
				setCurrentPlanTerm(updateSettings.planTerm);
				setActiveSubscription(result.data.subscription);

				/**
				 * Display success message
				 */
				setUpdateModalVisible(false);
				setUpdateLoading(false);
				setToastMessage("Subscription has been changed");
				setToastType("success");
				setToastDuration(6000);
				setToastVisible(true);
			}
		} catch (error) {
			if (axios.isCancel(error)) {
				return;
			}
			console.log(error);
			alert("An error occurred. Please, try again.");
		}
	};

	return (
		<div>
			<h3 className="section-title">Subscription</h3>

			<SubscriptionStatus activeSubscription={activeSubscription} plans={Plans} />

			<SubscriptionPlans planTerm={planTerm} setPlanTerm={setPlanTerm} currentPlan={currentPlan} plans={Plans} currentPlanTerm={currentPlanTerm} initiateCheckout={initiateCheckout} />

			{activeSubscription && <SubscriptionCancel activeSubscription={activeSubscription} cancelLoading={cancelLoading} cancelSubscription={cancelSubscription} />}

			<Refund />

			{modalVisible && <Modal title={modalTitle} body={modalBody} primaryAction={() => setModalVisible(false)} primaryActionLabel="Ok" onClose={() => setModalVisible(false)} />}

			{updateModalVisible && <Modal title={modalTitle} body={modalBody} primaryAction={() => updateSubscription()} primaryActionLabel="Change subscription" secondaryActionLabel="Keep current subscription" secondaryAction={() => setUpdateModalVisible(false)} onClose={() => setUpdateModalVisible(false)} loading={updateLoading} />}

			{toastVisible && <Toast onClose={() => setToastVisible(false)} duration={toastDuration} type={toastType} content={toastMessage} />}
		</div>
	);
}
