import { useEffect, useState } from "react";
import DashboardSection from "../DashboardSection";
import CampaignCard from "./CampaignCard";
import SkeletonCampaignCard from "../skeletons/SkeletonCampaignCard";
import EmptyState from "../EmptyState";
import Toast from "../Toast";
import CampaignSearch from "./CampaignSearch";

export default function CampaignList({ limit = 5, dashboard = false }) {
	const [loading, setLoading] = useState(true);
	const [campaigns, setCampaigns] = useState([]);
	const [campaignLimit, setCampaignLimit] = useState(10);
	const [campaignSearch, setCampaignSearch] = useState("");
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
	}, [campaignLimit]);

	return (
		<>
			{campaigns.length && dashboard ? <DashboardSection id="latest-campaigns" title="Latest Campaigns" actionLabel="View all campaigns" actionURL="/campaigns" /> : ""}

			{campaigns.length && !dashboard ? <CampaignSearch campaignSearch={campaignSearch} setCampaignSearch={setCampaignSearch} /> : ""}

			<div id="campaign-list">
				{loading && (
					<>
						<div className={`placeholder ${dashboard ? "height-5" : "height-3"}`}></div>
						<SkeletonCampaignCard items={3} />
					</>
				)}

				{campaigns.length ? (
					<>
						{campaigns.map((campaignItem, key) => (
							<CampaignCard key={key} id={campaignItem._id} name={campaignItem.name} type={campaignItem.type} status={campaignItem.status} participants={campaignItem.participantCount} visibleFrom={campaignItem.visibleFrom} visibleTo={campaignItem.visibleTo} getCampaigns={getCampaigns} setToastMessage={setToastMessage} setToastVisible={setToastVisible} setToastType={setToastType} setToastDuration={setToastDuration} />
						))}
					</>
				) : (
					""
				)}

				{!campaigns.length && !loading ? <EmptyState title="Create your first campaign" description="You haven't created any campaigns yet. Click the button below to get started." actionLink="/campaigns/create" actionLabel="Create New Campaign" helpLabel="###TODO Learn more" helpURL="https://" illustration="campaigns" /> : ""}
			</div>

			{toastVisible && <Toast onClose={() => setToastVisible(false)} duration={toastDuration} type={toastType} content={toastMessage} />}
		</>
	);
}
