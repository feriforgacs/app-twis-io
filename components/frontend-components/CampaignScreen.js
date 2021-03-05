import ScreenItem from "./screen-items/ScreenItem";
export default function CampaignScreen({ data, handleScreenClick }) {
	const screenStyle = {
		background: data.background.color,
	};
	return (
		<div className="screen" style={screenStyle} onClick={(e) => handleScreenClick(e)}>
			{data.screenItems.map((item, index) => (
				<ScreenItem item={item} key={index} />
			))}
		</div>
	);
}
