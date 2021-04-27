import { useState } from "react";
import axios from "axios";
import Modal from "../Modal";

export default function SubscriptionCancel({ activeSubscription, setActiveSubscription, setCurrentPlan, setCurrentPlanTerm }) {
	const [cancelModalVisible, setCancelModalVisible] = useState(false);
	const [cancelLoading, setCancelLoading] = useState(false);
	const [requestCancelToken, setRequestCancelToken] = useState();

	const cancelSubscription = async () => {
		setCancelLoading(true);

		if (requestCancelToken) {
			requestCancelToken.cancel();
		}

		let source = axios.CancelToken.source();
		setRequestCancelToken(source);

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

			if (subscription.data.success !== true) {
				alert("An error occured, please refresh the page and try again");
				return;
			}

			setCurrentPlan("");
			setCurrentPlanTerm("");
			setActiveSubscription(null);
			/**
			 * @todo display success message
			 */
		} catch (error) {
			if (axios.isCancel(error)) {
				return;
			}
			console.log(error);
			alert("An error occurred. Please, try again.");
		}
	};

	return (
		<div className="subscription__cancel">
			<h4>Cancel subscription</h4>
			<p>You can cancel your subscription any time by clicking the button below. The collected participant information and the campaigns you created won&apos;t be affected.</p>
			{activeSubscription && activeSubscription.plan !== "basic" && <p>If your current subscription is not the best option for you, you can also dowgrade your account to a smaller plan.</p>}
			<button className="button button--outline button--slim" onClick={() => setCancelModalVisible(true)}>
				Cancel subscription
			</button>

			{cancelModalVisible && <Modal title="Are you sure you want to cancel your subscription?" body="This won't affect the campaigns your created and the collected participant information" primaryAction={cancelSubscription} primaryActionLabel="Yes, cancel subscription" secondaryAction={() => setCancelModalVisible(false)} secondaryActionLabel="Keep subscription" onClose={() => setCancelModalVisible(false)} loading={cancelLoading} />}
		</div>
	);
}
