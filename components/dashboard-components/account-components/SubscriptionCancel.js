import { useState } from "react";
import Modal from "../Modal";

export default function SubscriptionCancel({ activeSubscription, cancelSubscription, cancelLoading }) {
	const [cancelModalVisible, setCancelModalVisible] = useState(false);

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
