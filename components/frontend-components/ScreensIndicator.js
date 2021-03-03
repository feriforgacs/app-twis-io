export default function ScreensIndicator({ screens, active = 0 }) {
	let indicators = [];
	for (let i = 0; i < screens; i++) {
		indicators.push(<div className={`indicator ${i === active ? "indicator--active" : ""}`}></div>);
	}

	return <div className="campaign-story__screens-indicator">{indicators}</div>;
}
