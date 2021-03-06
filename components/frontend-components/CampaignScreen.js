import ScreenItem from "./screen-items/ScreenItem";
export default function CampaignScreen({ data, handleScreenClick }) {
	const screenStyle = {
		background: data.background.color,
	};
	return (
		<div className="screen" style={screenStyle} onClick={(e) => handleScreenClick(e)}>
			<div className="screen__body">
				{data.screenItems.map((item) => (
					<ScreenItem item={item} key={item.itemId} />
				))}
			</div>
		</div>
	);
}
