import { useEffect, useState } from "react";
import DashboardSection from "../DashboardSection";
import CampaignCard from "./CampaignCard";
import SkeletonCampaignCard from "../skeletons/SkeletonCampaignCard";
import EmptyState from "../EmptyState";
import EmptyStateSearch from "../EmptyStateSearch";
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
	const [searching, setSearching] = useState(false);
	const [filtered, setFiltered] = useState(false);

	/**
	 * Get campaigns from the database
	 */
	const getCampaigns = async (reset = false) => {
		const campaignsRequest = await fetch(`${process.env.APP_URL}/api/campaigns?limit=${campaignLimit}&search=${reset ? "" : campaignSearch}`, {
			method: "GET",
		});

		const campaigns = await campaignsRequest.json();

		setLoading(false);
		setSearching(false);

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

	/**
	 * Filter campaign list
	 */
	const filterCampaigns = () => {
		setLoading(true);
		setSearching(true);
		setFiltered(true);
		getCampaigns();
	};

	const filterReset = () => {
		setCampaignSearch("");
		if (filtered) {
			setLoading(true);
			setFiltered(false);
			getCampaigns(true);
		}
	};

	return (
		<>
			{campaigns.length && dashboard ? <DashboardSection id="latest-campaigns" title="Latest Campaigns" actionLabel="View all campaigns" actionURL="/campaigns" /> : ""}

			{(campaigns.length || filtered) && !dashboard ? <CampaignSearch campaignSearch={campaignSearch} setCampaignSearch={setCampaignSearch} loading={loading} setLoading={setLoading} filterCampaigns={filterCampaigns} filterReset={filterReset} /> : ""}

			<div id="campaign-list">
				{/* Display loading state when getting campaigs on pageload or search */}
				{loading && (
					<>
						<div className={`placeholder ${dashboard ? "height-5" : "height-3"}`}></div>
						<SkeletonCampaignCard items={3} />
					</>
				)}

				{/* Display campaigns when not not empty and not searching */}
				{campaigns.length && !searching ? (
					<>
						{campaigns.map((campaignItem, key) => (
							<CampaignCard key={key} id={campaignItem._id} name={campaignItem.name} type={campaignItem.type} status={campaignItem.status} participants={campaignItem.participantCount} visibleFrom={campaignItem.visibleFrom} visibleTo={campaignItem.visibleTo} getCampaigns={getCampaigns} setToastMessage={setToastMessage} setToastVisible={setToastVisible} setToastType={setToastType} setToastDuration={setToastDuration} />
						))}
					</>
				) : (
					""
				)}

				{/* Display no result state when there are no search results */}
				{filtered && !campaigns.length && !searching ? <EmptyStateSearch title="No result" description="We couldn't find any items that fit your criteria. Please, try a different keyword" illustration="participants" /> : ""}

				{/* Empty state when there are no campaigns, not search result and not loading */}
				{!campaigns.length && !loading && !filtered ? <EmptyState title="Create your first campaign" description="You haven't created any campaigns yet. Click the button below to get started." actionLink="/campaigns/create" actionLabel="Create New Campaign" helpLabel="###TODO Learn more" helpURL="https://" illustration="campaigns" /> : ""}
			</div>

			{toastVisible && <Toast onClose={() => setToastVisible(false)} duration={toastDuration} type={toastType} content={toastMessage} />}
		</>
	);
}
