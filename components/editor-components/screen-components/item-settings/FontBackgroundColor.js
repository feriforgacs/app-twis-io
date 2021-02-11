import { useContext, useState, useEffect, useRef } from "react";
import { SketchPicker } from "react-color";
import { GlobalContext } from "../../../../context/GlobalState";
import styles from "../ScreenSettings.module.scss";

export default function FontBackgroundColor() {
	const { activeScreen, activeScreenItem, setActiveScreenItem, updateScreenItem, updateScreenItemInState } = useContext(GlobalContext);

	const [color, setColor] = useState(activeScreenItem.settings.highlightColor || "");
	const [colorPickerVisible, setColorPickerVisible] = useState(false);

	/**
	 * Update settings on active item change
	 */
	useEffect(() => {
		setColor(activeScreenItem.settings.highlightColor);
	}, [activeScreenItem]);

	const colorPickerContainerRef = useRef();

	const handleClickOutside = (e) => {
		if (!colorPickerContainerRef.current.contains(e.target)) {
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
			<button className={styles.colorPickerButton} onClick={() => setColorPickerVisible(true)} style={{ background: `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})` }}></button>
			{colorPickerVisible && (
				<div className={styles.colorPickerContainer} ref={colorPickerContainerRef}>
					<SketchPicker
						className="colorpicker"
						color={
							color || {
								r: 255,
								g: 255,
								b: 255,
								a: 1,
							}
						}
						onChange={(color) => {
							setColor(color.rgb);
							updateScreenItemInState(activeScreen.orderIndex, activeScreenItem.orderIndex, {
								settings: {
									...activeScreenItem.settings,
									highlightColor: color.rgb,
								},
							});
						}}
						onChangeComplete={(color) => {
							updateScreenItem(activeScreen.orderIndex, activeScreenItem.orderIndex, activeScreenItem.itemId, { settings: { ...activeScreenItem.settings, highlightColor: color.rgb } });
							setActiveScreenItem({ ...activeScreenItem, settings: { ...activeScreenItem.settings, highlightColor: color.rgb } });
						}}
					/>
				</div>
			)}
		</div>
	);
}
