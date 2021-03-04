export default function CampaignScreen({ data, width, height }) {
	const screenStyle = {
		background: data.background.color,
		height: `${height}px`,
		width: `${width}px`,
	};
	return (
		<div className="campaign-screen" style={screenStyle}>
			I am a screen {data.type} {data.screenId}
		</div>
	);
}
