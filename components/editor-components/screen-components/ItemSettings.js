import { useContext } from "react";
import { GlobalContext } from "../../../context/GlobalState";
import styles from "./ScreenSettings.module.scss";
import ItemAdditionalActions from "./ItemAdditionalActions";
import Opacity from "./item-settings/Opacity";
import FontFamily from "./item-settings/FontFamily";
import FontSize from "./item-settings/FontSize";
import FontStyle from "./item-settings/FontStyle";
import TextAlign from "./item-settings/TextAlign";
import FontColor from "./item-settings/FontColor";
import FontBackgroundColor from "./item-settings/FontBackgroundColor";
import ButtonAction from "./item-settings/ButtonAction";

export default function ItemSettings() {
	const { activeScreenItem, unsetActiveScreen, unsetActiveScreenItem } = useContext(GlobalContext);
	return (
		<div className={`${styles.settings} item-settings`}>
			<ItemAdditionalActions />
			<div className={`${styles.settingsHeader} item-settings`}>
				{activeScreenItem.type} Settings
				<button
					className={`${styles.settingsClose}`}
					onClick={() => {
						unsetActiveScreen();
						unsetActiveScreenItem();
					}}
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
						<line x1="18" y1="6" x2="6" y2="18"></line>
						<line x1="6" y1="6" x2="18" y2="18"></line>
					</svg>
				</button>
			</div>
			{activeScreenItem.type === "button" && <ButtonAction />}
			<Opacity />
			{activeScreenItem.type === "text" || activeScreenItem.type === "button" ? (
				<>
					<FontStyle />
					<TextAlign />
					<FontColor />
					<FontBackgroundColor />
					<FontFamily />
					<FontSize />
				</>
			) : (
				""
			)}
		</div>
	);
}
