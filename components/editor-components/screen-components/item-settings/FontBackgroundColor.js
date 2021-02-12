import { useContext, useState, useEffect, useRef } from "react";
import { SketchPicker } from "react-color";
import { GlobalContext } from "../../../../context/GlobalState";
import GradientPicker from "../screen-settings/GradientPicker";
import styles from "../ScreenSettings.module.scss";

export default function FontBackgroundColor() {
	const { activeScreen, activeScreenItem, setActiveScreenItem, updateScreenItem, updateScreenItemInState } = useContext(GlobalContext);

	const [background, setBackground] = useState(activeScreenItem.settings.highlightColor.background || ""); // this is to handle the background that was picked
	const [backgroundColor, setBackgroundColor] = useState(activeScreenItem.settings.highlightColor.backgroundColor || ""); // this is to handle the background color that is displayed
	const [colorPickerVisible, setColorPickerVisible] = useState(false);
	const [backgroundType, setBackgroundType] = useState(activeScreenItem.settings.highlightColor.type || "solid");

	/**
	 * Update settings on active item change
	 */
	useEffect(() => {
		setBackground(activeScreenItem.settings.highlightColor.background);
		setBackgroundColor(activeScreenItem.settings.highlightColor.backgroundColor);
		setBackgroundType(activeScreenItem.settings.highlightColor.type || "solid");
	}, [activeScreenItem]);

	const colorPickerContainerRef = useRef();

	const handleClickOutside = (e) => {
		if (colorPickerContainerRef.current && !colorPickerContainerRef.current.contains(e.target)) {
			setColorPickerVisible(false);
		}
	};

	useEffect(() => {
		if (colorPickerVisible) {
			document.addEventListener("mousedown", handleClickOutside);
		} else {
			document.removeEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [colorPickerVisible]);

	return (
		<div className={`${styles.settingsSection} screen-settings`}>
			<label className={`${styles.settingsLabel} screen-settings`}>Background Color</label>
			<button className={styles.colorPickerButton} onClick={() => setColorPickerVisible(true)} style={{ background: backgroundColor }}></button>
			{colorPickerVisible && (
				<div className={styles.colorPickerContainer} ref={colorPickerContainerRef}>
					<div className={styles.backgroundTypeTabs}>
						<button className={`${styles.backgroundTypeTab} ${backgroundType === "solid" ? styles.backgroundTypeTabActive : ""}`} onClick={() => setBackgroundType("solid")}>
							Solid
						</button>

						<button className={`${styles.backgroundTypeTab} ${backgroundType === "gradient" ? styles.backgroundTypeTabActive : ""}`} onClick={() => setBackgroundType("gradient")}>
							Gradient
						</button>
					</div>
					{backgroundType === "solid" && (
						<SketchPicker
							className="colorpicker"
							color={
								background || {
									r: 255,
									g: 255,
									b: 255,
									a: 1,
								}
							}
							onChange={(color) => {
								setBackground(color.rgb);
								updateScreenItemInState(activeScreen.orderIndex, activeScreenItem.orderIndex, {
									settings: {
										...activeScreenItem.settings,
										highlightColor: {
											type: backgroundType,
											backgroundColor: `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`,
											background: color.rgb,
										},
									},
								});
							}}
							onChangeComplete={(color) => {
								updateScreenItem(activeScreen.orderIndex, activeScreenItem.orderIndex, activeScreenItem.itemId, {
									settings: {
										...activeScreenItem.settings,
										highlightColor: {
											type: backgroundType,
											backgroundColor: `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`,
											background: color.rgb,
										},
									},
								});
								setActiveScreenItem({ ...activeScreenItem, settings: { ...activeScreenItem.settings, highlightColor: { type: backgroundType, backgroundColor: `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`, background: color.rgb } } });
							}}
						/>
					)}

					{backgroundType === "gradient" && (
						<GradientPicker
							background={backgroundColor}
							onSelect={(background) => {
								updateScreenItem(activeScreen.orderIndex, activeScreenItem.orderIndex, activeScreenItem.itemId, {
									settings: {
										...activeScreenItem.settings,
										highlightColor: {
											...activeScreenItem.settings.highlightColor,
											type: backgroundType,
											backgroundColor: background,
										},
									},
								});
								setActiveScreenItem({
									...activeScreenItem,
									settings: {
										...activeScreenItem.settings,
										highlightColor: {
											...activeScreenItem.settings.highlightColor,
											type: backgroundType,
											backgroundColor: background,
										},
									},
								});
							}}
						/>
					)}
				</div>
			)}
		</div>
	);
}
