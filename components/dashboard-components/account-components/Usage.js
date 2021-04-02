/**
 * @todo get usage from the db
 * @todo display usage numbers and dates in tooltip
 */
export default function Usage() {
	return (
		<div className="sidebar__usage-status">
			<div className="usage-status__progress-bar">
				<div className="usage-status__progress-value"></div>
			</div>
			<span>50% left of your monthly usage</span>
		</div>
	);
}
