import { useEffect, useState } from "react";
import { format } from "date-fns";
import Toast from "../Toast";
import SkeletonSubscriptionStatus from "../skeletons/SkeletonSubscriptionStatus";

export default function SubscriptionStatus({ currentPlan, currentPlanTerm, plans }) {
	const [loading, setLoading] = useState(true);
	const [currentUsage, setCurrentUsage] = useState({ limit: 0, value: 0, renewDate: Date.now() });

	const [toastMessage, setToastMessage] = useState(false);
	const [toastVisible, setToastVisible] = useState(false);
	const [toastType, setToastType] = useState("default");
	const [toastDuration, setToastDuration] = useState(3000);

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
		<>
			{loading ? (
				<SkeletonSubscriptionStatus />
			) : (
				<div className="user-subscription">
					<table>
						<tbody>
							<tr>
								<td>Your current plan:</td>
								<td>{currentPlan ? `${plans[currentPlan].name} - ${currentPlanTerm} (TODO / month)` : "You are not subscribed to any of the plans at the moment"}</td>
							</tr>
							{currentPlan ? (
								<tr>
									<td>Subscription renew date:</td>
									<td>TODO</td>
								</tr>
							) : null}
							<tr>
								<td>Usage limit:</td>
								<td>
									You can collect {currentUsage.limit} participants until {format(new Date(currentUsage.renewDate), "do MMM yyyy")}
								</td>
							</tr>

							<tr>
								<td>Usage status:</td>
								<td>
									{currentUsage.value} / {currentUsage.limit} participants collected
								</td>
							</tr>
							{currentPlan ? (
								<tr>
									<td>Usage resets on:</td>
									<td>{format(new Date(currentUsage.renewDate), "do MMM yyyy")}</td>
								</tr>
							) : null}
							{currentPlan && currentUsage.value > currentUsage.limit ? (
								<tr>
									<td>Overages cost:</td>
									<td>${Math.round((currentUsage.value - currentUsage.limit) * plans[currentPlan].overagesCost * 100) / 100}</td>
								</tr>
							) : null}
						</tbody>
					</table>
				</div>
			)}

			{toastVisible && <Toast onClose={() => setToastVisible(false)} duration={toastDuration} type={toastType} content={toastMessage} />}
		</>
	);
}
