export default function EmptyStateCampaigns() {
	return (
		<div className="empty-state">
			<div className="empty-state__header">
				<h4>This is an empty state header</h4>
			</div>
			<div className="empty-state__body">
				<div className="empty-state__copy">This is the description of the empty state</div>
				<div className="empty-state__illustration">
					<img src="/images/empty-states/campaigns.png" alt="" />
				</div>
			</div>
		</div>
	);
}
