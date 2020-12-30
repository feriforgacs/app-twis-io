import CampaignCard from "./CampaignCard";
import SkeletonCampaignCard from "../skeletons/SkeletonCampaignCard";

export default function CampaignList({ limit = 5 }) {
	return (
		<div id="campaign-list">
			<SkeletonCampaignCard items={3} />
			<CampaignCard id={12345} name={`This is a sample campaign`} type={`quiz`} status={`active`} participants={1234} visibleFrom={`2021.01.01.`} visibleTo={`2021.02.01.`} />
			<CampaignCard id={12345} name={`This is a sample campaign`} type={`quiz`} status={`active`} participants={1234} visibleFrom={`2021.01.01.`} visibleTo={`2021.02.01.`} />
			<CampaignCard id={12345} name={`This is a sample campaign`} type={`quiz`} status={`active`} participants={1234} visibleFrom={`2021.01.01.`} visibleTo={`2021.02.01.`} />
		</div>
	);
}
