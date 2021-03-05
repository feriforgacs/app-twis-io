export default function ScreensIndicator({ screens, active = 0 }) {
	let indicators = [];
	for (let i = 0; i < screens; i++) {
		indicators.push(<div key={i} className={`indicator ${i <= active ? "indicator--active" : ""}`}></div>);
	}

	return <div className="screens-indicator">{indicators}</div>;
}
