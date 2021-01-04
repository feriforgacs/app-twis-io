import { useEffect, useState } from "react";
import CampaignCard from "./CampaignCard";
import SkeletonCampaignCard from "../skeletons/SkeletonCampaignCard";
import EmptyStateCampaigns from "../empty-states/EmptyStateCampaigns";

export default function CampaignList({ limit = 5 }) {
	const [loading, setLoading] = useState(false);
	const [campaigns, setCampaigns] = useState([]);

	/**
	 * TODO
	 * Get campaigns from the database
	 */
	useEffect(() => {});

	return (
		<div id="campaign-list">
			{loading && <SkeletonCampaignCard items={3} />}

			{campaigns.count ? (
				<>
					<CampaignCard id={12345} name={`This is a sample campaign`} type={`quiz`} status={`active`} participants={1234} visibleFrom={`2021.01.01.`} visibleTo={`2021.02.01.`} />
					<CampaignCard id={12345} name={`This is a sample campaign`} type={`quiz`} status={`active`} participants={1234} visibleFrom={`2021.01.01.`} visibleTo={`2021.02.01.`} />
					<CampaignCard id={12345} name={`This is a sample campaign`} type={`quiz`} status={`active`} participants={1234} visibleFrom={`2021.01.01.`} visibleTo={`2021.02.01.`} />
				</>
			) : (
				<EmptyStateCampaigns />
			)}
		</div>
	);
}
