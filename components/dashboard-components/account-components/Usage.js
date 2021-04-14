/**
 * @todo get usage from the db
 * @todo display real usage numbers and dates in tooltip
 */
import { useState, useEffect } from "react";
import ReactTooltip from "react-tooltip";
import { format } from "date-fns";

export default function Usage() {
	const [loading, setLoading] = useState(true);
	const [currentUsage, setCurrentUsage] = useState({ limit: 0, value: 0, renewDate: Date.now() });
	const [error, setError] = useState();
	const [usageLeft, setUsageLeft] = useState(0);

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
					setError("Can't get usage information.");
					return;
				}

				if (usageData.data) {
					setCurrentUsage(usageData.data);
					let currentUsageLeft = 0;
					if (usageData.data.value === 0) {
						currentUsageLeft = 100;
					} else if (usageData.data.value < usageData.data.limit) {
						currentUsageLeft = 100 - Math.floor((usageData.data.value / usageData.data.limit) * 100);
					}
					setUsageLeft(currentUsageLeft);
				}
			} catch (error) {
				console.log(error);
				setLoading(false);
				setError("Can't get usage information.");
			}

			return;
		};

		getUsage();
	}, []);

	return (
		<>
			{loading ? (
				<p className="sidebar__usage-loading">loading...</p>
			) : (
				<div className="sidebar__usage-status" data-for="usagetooltip" data-tip={`With your current plan, you can collect ${currentUsage.limit - currentUsage.value > 0 ? currentUsage.limit - currentUsage.value : 0} more unique participants until ${format(new Date(currentUsage.renewDate), "do MMM yyyy")}`}>
					<div className="usage-status__progress-bar">
						<div
							className={`usage-status__progress-value ${usageLeft < 40 && "usage-status__progress-value--alert"} ${usageLeft < 5 && "usage-status__progress-value--danger"}`}
							style={{
								width: `${100 - usageLeft}%`,
							}}
						></div>
					</div>
					<span>
						{loading && "loading..."}
						{error ? error : `${usageLeft}% left of your monthly usage`}
					</span>

					<ReactTooltip id="usagetooltip" place="top" type="dark" effect="solid" getContent={(dataTip) => dataTip} />
				</div>
			)}
		</>
	);
}
