export default function CampaignScreen({ data }) {
	const screenStyle = {
		background: data.background.color,
	};
	return (
		<div className="screen" style={screenStyle}>
			I am a screen {data.type} {data.screenId}
		</div>
	);
}
