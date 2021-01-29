import { useContext } from "react";
import { GlobalContext } from "../../../../context/GlobalState";
export default function Image({ data, screenItemIndex }) {
	const { setActiveScreenItem } = useContext(GlobalContext);
	const imageStyle = {
		height: data.settings.height,
		width: data.settings.width,
		top: data.settings.top,
		left: data.settings.left,
		position: "absolute",
	};
	return <img onClick={() => setActiveScreenItem(data)} id={`${data.type}-${data.itemId}`} className="screen-item" src={data.src} style={imageStyle} />;
}
