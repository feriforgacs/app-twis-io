import { useContext } from "react";
import { FrontendContext } from "../../context/frontend/FrontendState";
import ScreenItem from "./screen-items/ScreenItem";

export default function CampaignScreen({ data, lastScreenIndex, scale, marginLeft }) {
	const { handleScreenClick } = useContext(FrontendContext);
	const screenStyle = {
		background: data.background.color,
	};

	const screenBodyStyle = {
		transform: `scale(${scale})`,
		marginLeft: `${marginLeft}px`,
	};
	return (
		<>
			<div className="screen" style={screenStyle} onClick={(e) => handleScreenClick(e, lastScreenIndex)}>
				<div className="screen__body" style={screenBodyStyle}>
					{data.screenItems.map((item) => (
						<ScreenItem item={item} key={item.itemId} lastScreenIndex={lastScreenIndex} />
					))}
				</div>
			</div>
			<div id="screen-orientation-alert">
				<svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M31 12H18C16.5641 12 15.4 13.1641 15.4 14.6V35.4C15.4 36.8359 16.5641 38 18 38H31C32.4359 38 33.6 36.8359 33.6 35.4V14.6C33.6 13.1641 32.4359 12 31 12Z" stroke="#A30FBB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
					<path d="M24.5 32.8H24.513" stroke="#A30FBB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
					<path d="M5.20833 10.4167V16.6667H11.4583M38.5417 33.3333H44.7917V39.5833" stroke="#A30FBB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
					<path d="M45.8333 23.9583C45.636 19.399 43.9471 15.0305 41.026 11.5242C38.1049 8.01791 34.1134 5.56776 29.6646 4.55022C25.2159 3.53269 20.5561 4.00407 16.4012 5.89195C12.2464 7.77982 8.82635 10.9797 6.66667 15M4.16667 26.0417C4.40512 30.5843 6.12381 34.9241 9.06028 38.3982C11.9968 41.8724 15.9896 44.29 20.4291 45.2818C24.8686 46.2736 29.5106 45.7851 33.6464 43.8909C37.7822 41.9967 41.1844 38.801 43.3333 34.7917" stroke="#A30FBB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
				</svg>
			</div>
		</>
	);
}
