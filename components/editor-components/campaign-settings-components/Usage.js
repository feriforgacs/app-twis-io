import { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import styles from "../CampaignSettings.module.scss";

export default function Usage() {
	const [usageLoading, setUsageLoading] = useState(true);
	const [currentUsage, setCurrentUsage] = useState({ limit: 0, value: 0, renewDate: Date.now() });
	const [currentUsageError, setCurrentUsageError] = useState("");
	const [usageLeft, setUsageLeft] = useState(0);

	useEffect(() => {
		/**
		 * Get usage info for current user
		 */
		let requestCancelToken;
		const getUsage = async () => {
			if (requestCancelToken) {
				requestCancelToken.cancel();
			}

			let source = axios.CancelToken.source();
			requestCancelToken = source;

			try {
				const usageResult = await axios.get(
					`/api/account/usage`,
					{
						headers: {
							"Content-Type": "application/json",
						},
					},
					{ cancelToken: source.token }
				);

				setUsageLoading(false);

				if (usageResult.data.success !== true) {
					setCurrentUsageError("can't get usage data");
				} else {
					setCurrentUsage(usageResult.data.data);
					let currentUsageLeft = 0;
					if (usageResult.data.data.value === 0) {
						currentUsageLeft = usageResult.data.data.limit;
					} else if (usageResult.data.data.value < usageResult.data.data.limit) {
						currentUsageLeft = usageResult.data.data.limit - usageResult.data.data.value;
					}
					setUsageLeft(currentUsageLeft);
				}
			} catch (error) {
				setUsageLoading(false);
				if (axios.isCancel(error)) {
					return;
				}
				console.log(error);
				setCurrentUsageError(true);
			}
		};

		getUsage();

		return () => {
			if (requestCancelToken) {
				requestCancelToken.cancel();
			}
		};
	}, []);

	return (
		<div className={styles.settingsPanelSection}>
			{usageLoading ? (
				"loading..."
			) : (
				<div>
					{usageLeft && !currentUsageError ? (
						<>
							With your current plan, you can collect {usageLeft} more unique participants until {format(new Date(currentUsage.renewDate), "yyyy.MM.dd.")} without additional costs.
						</>
					) : (
						<>You&apos;ve reached your monthly usage limit. It&apos;ll reset on {format(new Date(currentUsage.renewDate), "yyyy.MM.dd.")}</>
					)}
					Check detailed usage info under{" "}
					<a href="/account" target="_blank" rel="noopener noreferrer">
						your account
					</a>
					.
				</div>
			)}
		</div>
	);
}
