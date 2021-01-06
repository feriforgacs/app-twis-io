import { useEffect, useState } from "react";
import DashboardSection from "../DashboardSection";
import CampaignCard from "./CampaignCard";
import SkeletonCampaignCard from "../skeletons/SkeletonCampaignCard";
import EmptyState from "../EmptyState";
import Toast from "../Toast";

export default function CampaignList({ limit = 5, dashboard = false }) {
	const [loading, setLoading] = useState(true);
	const [campaigns, setCampaigns] = useState([]);
	const [campaignLimit, setCampaignLimit] = useState(10);
	const [campaignSearch, setCampaignSearch] = useState();
	const [toastMessage, setToastMessage] = useState(false);
	const [toastVisible, setToastVisible] = useState(false);
	const [toastType, setToastType] = useState("default");
	const [toastDuration, setToastDuration] = useState(3000);

	/**
	 * Get campaigns from the database
	 */
	const getCampaigns = async () => {
		const campaignsRequest = await fetch(`${process.env.APP_URL}/api/campaigns?limit=${campaignLimit}&search=${campaignSearch}`, {
			method: "GET",
		});

		const campaigns = await campaignsRequest.json();

		setLoading(false);

		if (campaigns.success !== true) {
			// error
			setToastMessage("Can't get campaigns. Please, try again.");
			setToastType("error");
			setToastDuration(6000);
			setToastVisible(true);
			return;
		}

		if (campaigns.data) {
			setCampaigns(campaigns.data);
		}
		return;
	};

	/**
	 * Get campaigns from the database on component load
	 */
	useEffect(() => {
		getCampaigns();
	}, [campaignLimit, campaignSearch]);

	return (
		<>
			{campaigns.length && dashboard ? <DashboardSection id="latest-campaigns" title="Latest Campaigns" actionLabel="View all campaigns" actionURL="/campaigns" /> : ""}
			<div id="campaign-list">
				{loading && (
					<>
						<div className="placeholder height-3"></div>
						<SkeletonCampaignCard items={3} />
					</>
				)}

				{campaigns.length ? (
					<>
						<CampaignCard id={12345} name={`This is a sample campaign`} type={`quiz`} status={`active`} participants={1234} visibleFrom={`2021.01.01.`} visibleTo={`2021.02.01.`} />
						<CampaignCard id={12345} name={`This is a sample campaign`} type={`quiz`} status={`active`} participants={1234} visibleFrom={`2021.01.01.`} visibleTo={`2021.02.01.`} />
						<CampaignCard id={12345} name={`This is a sample campaign`} type={`quiz`} status={`active`} participants={1234} visibleFrom={`2021.01.01.`} visibleTo={`2021.02.01.`} />
					</>
				) : (
					<EmptyState title="Create your first campaign" description="You haven't created any campaigns yet. Click the button below to get started." actionLink="/campaigns/create" actionLabel="Create New Campaign" helpLabel="Learn more" helpURL="https://" illustration="campaigns" />
				)}
			</div>

			{toastVisible && <Toast onClose={() => setToastVisible(false)} duration={toastDuration} type={toastType} content={toastMessage} />}
		</>
	);
}
