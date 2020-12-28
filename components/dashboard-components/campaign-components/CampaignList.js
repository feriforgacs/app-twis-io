import CampaignCard from "./CampaignCard";

export default function CampaignList({ limit = 5 }) {
	return (
		<div id="campaign-list">
			<CampaignCard id={12345} name={`This is a sample campaign`} type={`quiz`} status={`active`} participants={1234} visibleFrom={`2021.01.01.`} visibleTo={`2021.02.01.`} />
		</div>
	);
}
