import { useContext } from "react";
import { GlobalContext } from "../../../../context/GlobalState";

export default function Text({ data }) {
	const { activeScreenItem, setActiveScreenItem } = useContext(GlobalContext);
	const screenItemActive = activeScreenItem.itemId === data.itemId;

	let textContainerStyle = {
		textAlign: data.settings.align,
		width: `${data.settings.width}px`,
		height: `${data.settings.height}px`,
		transform: `translateX(${data.settings.translateX}px) translateY(${data.settings.translateY}px) rotate(${data.settings.rotate}deg)`,
		top: `${data.settings.top}px`,
		left: `${data.settings.left}px`,
		position: "absolute",
	};

	if (screenItemActive) {
		textContainerStyle.cursor = "move";
	}

	let textStyle = {
		background: data.settings.highlightColor,
		color: data.settings.color,
		fontFamily: data.settings.fontFamily,
		fontSize: `${data.settings.fontSize}px`,
		fontWeight: data.settings.bold ? 700 : 400,
		fontStyle: data.settings.italic ? `italic` : `normal`,
		textDecoration: data.settings.underline ? `underline` : `none`,
	};

	return (
		<div onClick={() => setActiveScreenItem(data)} style={textContainerStyle} id={`${data.type}-${data.itemId}`} className="screen-item">
			<span className="screen-item-children" style={textStyle}>
				{data.content}
			</span>
		</div>
	);
}
