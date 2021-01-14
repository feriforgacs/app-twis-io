import { useEffect, useState } from "react";
import NProgress from "nprogress";
import DashboardSection from "../DashboardSection";
import CampaignCard from "./CampaignCard";
import SkeletonCampaignCard from "../skeletons/SkeletonCampaignCard";
import SkeletonSearchForm from "../skeletons/SkeletonSearchForm";
import EmptyState from "../EmptyState";
import EmptyStateSearch from "../EmptyStateSearch";
import Toast from "../Toast";
import CampaignSearch from "./CampaignSearch";
import FooterHelp from "../FooterHelp";
import LinkComponent from "../LinkComponent";

export default function CampaignList({ limit = 50, dashboard = false }) {
	const [loading, setLoading] = useState(true);
	const [campaigns, setCampaigns] = useState([]);
	const [campaignLimit] = useState(limit);
	const [campaignSearch, setCampaignSearch] = useState("");
	const [toastMessage, setToastMessage] = useState(false);
	const [toastVisible, setToastVisible] = useState(false);
	const [toastType, setToastType] = useState("default");
	const [toastDuration, setToastDuration] = useState(3000);
	const [searching, setSearching] = useState(false);
	const [filtered, setFiltered] = useState(false);
	const [reload, setReload] = useState(false);

	useEffect(() => {
		/**
		 * Get campaigns from the database on component load
		 */
		const getCampaigns = async () => {
			NProgress.start();
			const campaignsRequest = await fetch(`${process.env.APP_URL}/api/campaigns?limit=${campaignLimit}&search=${campaignSearch}`, {
				method: "GET",
			});

			const campaigns = await campaignsRequest.json();

			setLoading(false);
			setSearching(false);
			setReload(false);
			NProgress.done();

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

		getCampaigns();
	}, [campaignLimit, campaignSearch, reload]);

	/**
	 * Filter campaign list
	 */
	const filterCampaigns = (keyword) => {
		setLoading(true);
		setSearching(true);
		setFiltered(true);
		setCampaignSearch(keyword);
	};

	const filterReset = () => {
		setCampaignSearch("");
		setSearching(true);
		if (filtered) {
			setLoading(true);
			setFiltered(false);
		}
	};

	return (
		<>
			{campaigns.length && dashboard ? <DashboardSection id="latest-campaigns" title="Latest Campaigns" actionLabel="View all campaigns" actionURL="/campaigns" /> : ""}

			{loading && !dashboard && !searching && (
				<>
					<div className={`placeholder height-2`}></div>
					<SkeletonSearchForm />
				</>
			)}
			{(campaigns.length || filtered) && !dashboard ? <CampaignSearch loading={loading} setLoading={setLoading} filterCampaigns={filterCampaigns} filterReset={filterReset} /> : ""}

			<div id="campaign-list">
				{/* Display loading state when getting campaigs on pageload or search */}
				{loading && (
					<>
						<div className={`placeholder ${dashboard ? "height-5" : ""}`}></div>
						<SkeletonCampaignCard items={3} />
					</>
				)}

				{/* Display campaigns when not not empty and not searching */}
				{campaigns.length && !searching ? (
					<>
						{campaigns.map((campaignItem, key) => (
							<CampaignCard key={key} id={campaignItem._id} name={campaignItem.name} type={campaignItem.type} status={campaignItem.status} participants={campaignItem.participantCount} visibleFrom={campaignItem.visibleFrom} visibleTo={campaignItem.visibleTo} reloadCampaigns={setReload} setToastMessage={setToastMessage} setToastVisible={setToastVisible} setToastType={setToastType} setToastDuration={setToastDuration} />
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

			{!dashboard && (
				<FooterHelp>
					Lrean more about <LinkComponent url="http://twis.io">campaign best practices</LinkComponent>
				</FooterHelp>
			)}

			{toastVisible && <Toast onClose={() => setToastVisible(false)} duration={toastDuration} type={toastType} content={toastMessage} />}
		</>
	);
}
