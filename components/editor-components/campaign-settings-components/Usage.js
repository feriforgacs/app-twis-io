import { useState, useEffect } from "react";
import axios from "axios";
import styles from "../CampaignSettings.module.scss";

export default function Usage() {
	const [usageLoading, setUsageLoading] = useState(true);
	const [currentUsage, setCurrentUsage] = useState({ limit: 0, value: 0, renewDate: Date.now() });
	const [currentUsageError, setCurrentUsageError] = useState("");
	const [requestCancelToken, setRequestCancelToken] = useState();
	const [usageLeft, setUsageLeft] = useState(0);

	useEffect(() => {
		/**
		 * Get usage info for current user
		 */
		const getUsage = async () => {
			if (requestCancelToken) {
				requestCancelToken.cancel();
			}

			let source = axios.CancelToken.source();
			setRequestCancelToken(source);

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
						currentUsageLeft = 100;
					} else if (usageResult.data.data.value < usageResult.data.data.limit) {
						currentUsageLeft = 100 - Math.floor((usageResult.data.data.value / usageResult.data.data.limit) * 100);
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
	}, []);

	return (
		<div className={styles.settingsPanelSection}>
			{usageLoading && <p>loading...</p>}
			{!currentUsageError ? `Usage aaa ${usageLeft}` : ""}
		</div>
	);
}
