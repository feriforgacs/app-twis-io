/**
 * @todo get usage from the db
 * @todo display real usage numbers and dates in tooltip
 */
import { useState, useEffect } from "react";
import ReactTooltip from "react-tooltip";

export default function Usage() {
	const [loading, setLoading] = useState(true);
	const [currentUsage, setCurrentUsage] = useState();
	const [error, setError] = useState();

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
		<div className="sidebar__usage-status" data-for="usagetooltip" data-tip="With your current plan, you can collect 34 more unique participants until 2021.04.05.">
			<div className="usage-status__progress-bar">
				<div className="usage-status__progress-value"></div>
			</div>
			<span>
				{loading && "loading..."}
				{error ? error : "50% left of your monthly usage"}
			</span>

			<ReactTooltip id="usagetooltip" place="top" type="dark" effect="solid" getContent={(dataTip) => dataTip} />
		</div>
	);
}
