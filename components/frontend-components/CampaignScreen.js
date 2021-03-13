import { useContext } from "react";
import { FrontendContext } from "../../context/frontend/FrontendState";
import ScreenItem from "./screen-items/ScreenItem";

export default function CampaignScreen({ data, lastScreenIndex, scale }) {
	const { handleScreenClick } = useContext(FrontendContext);
	const screenStyle = {
		background: data.background.color,
		transform: `scale(${scale})`,
	};
	return (
		<div className="screen" style={screenStyle} onClick={(e) => handleScreenClick(e, lastScreenIndex)}>
			<div className="screen__body">
				{data.screenItems.map((item) => (
					<ScreenItem item={item} key={item.itemId} lastScreenIndex={lastScreenIndex} />
				))}
			</div>
		</div>
	);
}
