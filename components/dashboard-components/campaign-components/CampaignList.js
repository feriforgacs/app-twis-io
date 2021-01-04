import { useEffect, useState } from "react";
import CampaignCard from "./CampaignCard";
import SkeletonCampaignCard from "../skeletons/SkeletonCampaignCard";
import EmptyState from "../EmptyState";

export default function CampaignList({ limit = 5 }) {
	const [loading, setLoading] = useState(false);
	const [campaigns, setCampaigns] = useState([]);

	const createNewCampaign = () => {
		alert("TODO");
	};

	/**
	 * TODO
	 * Get campaigns from the database
	 */
	useEffect(() => {});

	return (
		<div id="campaign-list">
			{loading && <SkeletonCampaignCard items={3} />}

			{campaigns.length ? (
				<>
					<CampaignCard id={12345} name={`This is a sample campaign`} type={`quiz`} status={`active`} participants={1234} visibleFrom={`2021.01.01.`} visibleTo={`2021.02.01.`} />
					<CampaignCard id={12345} name={`This is a sample campaign`} type={`quiz`} status={`active`} participants={1234} visibleFrom={`2021.01.01.`} visibleTo={`2021.02.01.`} />
					<CampaignCard id={12345} name={`This is a sample campaign`} type={`quiz`} status={`active`} participants={1234} visibleFrom={`2021.01.01.`} visibleTo={`2021.02.01.`} />
				</>
			) : (
				<EmptyState title="Create your first campaign" description="You haven't created any campaigns yet. Click the button below to get started." action={createNewCampaign} actionLabel="Create New Campaign" helpLabel="Learn more" helpURL="https://" illustration="campaigns" />
			)}
		</div>
	);
}
