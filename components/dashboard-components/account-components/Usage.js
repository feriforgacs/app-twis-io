/**
 * @todo get usage from the db
 * @todo display usage numbers and dates in tooltip
 */
import ReactTooltip from "react-tooltip";

export default function Usage() {
	return (
		<div className="sidebar__usage-status" data-for="usagetooltip" data-tip="With your current plan, you can collect 34 more unique participants until 2021.04.05.">
			<div className="usage-status__progress-bar">
				<div className="usage-status__progress-value"></div>
			</div>
			<span>50% left of your monthly usage</span>

			<ReactTooltip id="usagetooltip" place="top" type="dark" effect="solid" getContent={(dataTip) => dataTip} />
		</div>
	);
}
