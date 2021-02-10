import { useContext, useState, useEffect } from "react";
import ReactTooltip from "react-tooltip";
import { GlobalContext } from "../../../../context/GlobalState";
import styles from "../ScreenSettings.module.scss";

export default function TextAlign() {
	const { activeScreen, activeScreenItem, setActiveScreenItem, updateScreenItem } = useContext(GlobalContext);

	const [align, setAlign] = useState(activeScreenItem.settings.align || "left");

	/**
	 * Update settings on active item change
	 */
	useEffect(() => {
		setAlign(activeScreenItem.settings.align);
	}, [activeScreenItem]);

	return (
		<div className={`${styles.settingsSection} item-settings`}>
			<div className={`${styles.fontStyleSettings} item-settings`}>
				<button
					data-for="textAlign"
					data-tip="Align left"
					className={`${styles.fontStyleButton} ${align === "left" ? styles.fontStyleButtonActive : ""}`}
					onClick={() => {
						if (align !== "left") {
							setAlign("left");
							updateScreenItem(activeScreen.orderIndex, activeScreenItem.orderIndex, activeScreenItem.itemId, { settings: { ...activeScreenItem.settings, align: "left" } });
							setActiveScreenItem({ ...activeScreenItem, settings: { ...activeScreenItem.settings, align: "left" } });
						}
					}}
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
						<path d="M17 9.5H3M21 4.5H3M21 14.5H3M17 19.5H3" />
					</svg>
				</button>

				<button
					data-for="textAlign"
					data-tip="Align center"
					className={`${styles.fontStyleButton} ${align === "center" ? styles.fontStyleButtonActive : ""}`}
					onClick={() => {
						if (align !== "center") {
							setAlign("center");
							updateScreenItem(activeScreen.orderIndex, activeScreenItem.orderIndex, activeScreenItem.itemId, { settings: { ...activeScreenItem.settings, align: "center" } });
							setActiveScreenItem({ ...activeScreenItem, settings: { ...activeScreenItem.settings, align: "center" } });
						}
					}}
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
						<path d="M19 9.5H5M21 4.5H3M21 14.5H3M19 19.5H5" />
					</svg>
				</button>

				<button
					data-for="textAlign"
					data-tip="Align right"
					className={`${styles.fontStyleButton} ${align === "right" ? styles.fontStyleButtonActive : ""}`}
					onClick={() => {
						if (align !== "right") {
							setAlign("right");
							updateScreenItem(activeScreen.orderIndex, activeScreenItem.orderIndex, activeScreenItem.itemId, { settings: { ...activeScreenItem.settings, align: "right" } });
							setActiveScreenItem({ ...activeScreenItem, settings: { ...activeScreenItem.settings, align: "right" } });
						}
					}}
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
						<path d="M21 9.5H7M21 4.5H3M21 14.5H3M21 19.5H7" />
					</svg>
				</button>

				<button
					data-for="textAlign"
					data-tip="Align justify"
					className={`${styles.fontStyleButton} ${align === "justify" ? styles.fontStyleButtonActive : ""}`}
					onClick={() => {
						if (align !== "justify") {
							setAlign("justify");
							updateScreenItem(activeScreen.orderIndex, activeScreenItem.orderIndex, activeScreenItem.itemId, { settings: { ...activeScreenItem.settings, align: "justify" } });
							setActiveScreenItem({ ...activeScreenItem, settings: { ...activeScreenItem.settings, align: "justify" } });
						}
					}}
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
						<path d="M21 9.5H3M21 4.5H3M21 14.5H3M21 19.5H3" />
					</svg>
				</button>
			</div>

			<ReactTooltip id="textAlign" place="bottom" type="dark" effect="solid" getContent={(dataTip) => `${dataTip}`} />
		</div>
	);
}
