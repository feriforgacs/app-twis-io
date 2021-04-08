import { useEffect, useState } from "react";
import { format } from "date-fns";
import Toast from "../Toast";

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
							Usage limit:{" "}
							<strong>
								You can collect {currentUsage.limit} unique participants until {format(new Date(currentUsage.renewDate), "yyy.MM.dd.")}
							</strong>
						</p>
						<p>
							Usage status:{" "}
							<strong>
								{currentUsage.value} / {currentUsage.limit} unique participants
							</strong>
						</p>
						{currentPlan && (
							<p>
								Plan renew date: <strong>{format(new Date(currentUsage.renewDate), "yyy.MM.dd.")}</strong>
							</p>
						)}
						{currentPlan && currentUsage.value > currentUsage.limit && <p>Overages cost: ${Math.round((currentUsage.value - currentUsage.limit) * plans[currentPlan].overagesCost * 100) / 100}</p>}
					</div>
					<div className="user-subscription__renew-date"></div>
				</div>
			)}

			{toastVisible && <Toast onClose={() => setToastVisible(false)} duration={toastDuration} type={toastType} content={toastMessage} />}
		</>
	);
}
