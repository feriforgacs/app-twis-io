import { useEffect, useState } from "react";
import { format, addMonths, addYears } from "date-fns";
import Toast from "../Toast";
import SkeletonSubscriptionStatus from "../skeletons/SkeletonSubscriptionStatus";

export default function SubscriptionStatus({ activeSubscription, plans }) {
	const [loading, setLoading] = useState(true);
	const [currentUsage, setCurrentUsage] = useState({ limit: 0, value: 0, renewDate: Date.now() });

	const [toastMessage, setToastMessage] = useState(false);
	const [toastVisible, setToastVisible] = useState(false);
	const [toastType, setToastType] = useState("default");
	const [toastDuration, setToastDuration] = useState(3000);

	let planRenewDate;
	if (activeSubscription && activeSubscription.planTerm === "monthly") {
		planRenewDate = addMonths(new Date(activeSubscription.paymentDate), 1);
	} else if (activeSubscription && activeSubscription.planTerm === "yearly") {
		planRenewDate = addYears(new Date(activeSubscription.paymentDate), 1);
	}

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
							{activeSubscription ? (
								<>
									<tr>
										<td>
											<strong>Plan</strong>
										</td>
										<td>
											{`${plans[activeSubscription.plan].name} - ${activeSubscription.planTerm} ($${activeSubscription.monthlyFee} / month)`}
											<br />
											{currentUsage.limit} participants/month
											<br />${activeSubscription.overagesPrice} per additional participant
											<br />
											Renews on {format(new Date(planRenewDate), "do MMM yyyy")}
										</td>
									</tr>
								</>
							) : (
								<tr>
									<td>
										<strong>Plan</strong>
									</td>
									<td>You are not subscribed to any of the plans</td>
								</tr>
							)}

							<tr>
								<td>
									<strong>Usage stats</strong>
								</td>
								<td>
									{currentUsage.value} / {currentUsage.limit} participants collected
								</td>
							</tr>

							{activeSubscription ? (
								<tr>
									<td>
										<strong>Usage resets on</strong>
									</td>
									<td>{format(new Date(currentUsage.renewDate), "do MMM yyyy")}</td>
								</tr>
							) : null}
							{activeSubscription && currentUsage.value > currentUsage.limit ? (
								<tr>
									<td>
										<strong>Overages cost</strong>
									</td>
									<td>
										${Math.round((currentUsage.value - currentUsage.limit) * activeSubscription.overagesPrice * 100) / 100} <small>( VAT not included )</small>
									</td>
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
