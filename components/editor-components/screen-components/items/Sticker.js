import { useContext } from "react";
import { GlobalContext } from "../../../../context/GlobalState";

export default function Sticker({ data }) {
	const { activeScreenItem, setActiveScreenItem } = useContext(GlobalContext);
	const screenItemActive = activeScreenItem.itemId === data.itemId;
	const imageStyle = {
		height: `${data.settings.height || 0}px`,
		width: `${data.settings.width || 0}px`,
		top: `${data.settings.top || 0}px`,
		left: `${data.settings.left || 0}px`,
		transform: `translateX(${data.settings.translateX || 0}px) translateY(${data.settings.translateY || 0}px) rotate(${data.settings.rotate || 0}deg)`,
		position: "absolute",
	};

	if (screenItemActive) {
		imageStyle.cursor = "move";
	}

	return <img onClick={() => setActiveScreenItem(data)} id={`${data.type}-${data.itemId}`} className="screen-item" src={data.src} style={imageStyle} />;
}
