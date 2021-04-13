import { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import styles from "../screen-components/ScreenSettings.module.scss";

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
		<>
			{usageLoading ? (
				""
			) : (
				<div className={`${styles.settingsSection} item-settings`}>
					<p className={styles.itemInfo}>
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5a38fc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
							<circle cx="12" cy="12" r="10"></circle>
							<line x1="12" y1="16" x2="12" y2="12"></line>
							<line x1="12" y1="8" x2="12.01" y2="8"></line>
						</svg>
						<span>
							{usageLeft && !currentUsageError ? (
								<>
									With your current plan, you can collect{" "}
									<strong>
										{usageLeft} more unique participants until {format(new Date(currentUsage.renewDate), "yyyy.MM.dd.")}
									</strong>{" "}
									without additional costs.
								</>
							) : (
								<>
									<strong>You&apos;ve reached your monthly usage limit.</strong> It&apos;ll reset on {format(new Date(currentUsage.renewDate), "yyyy.MM.dd.")}. Your campaigns will keep collecting participant information but you&apos;ll have some additional costs.
								</>
							)}
							<br />
							<a href="/account" target="_blank" rel="noopener noreferrer">
								View detailed usage information.
							</a>
						</span>
					</p>
				</div>
			)}
		</>
	);
}
