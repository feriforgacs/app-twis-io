import { useContext, useState, useEffect, useRef } from "react";
import { SketchPicker } from "react-color";
import { GlobalContext } from "../../../../context/GlobalState";
import styles from "../ScreenSettings.module.scss";

export default function FontColor() {
	const { activeScreen, activeScreenItem, setActiveScreenItem, updateScreenItem, updateScreenItemInState } = useContext(GlobalContext);

	const [color, setColor] = useState(activeScreenItem.settings.color || "#333333");
	const [colorPickerVisible, setColorPickerVisible] = useState(false);

	/**
	 * Update settings on active item change
	 */
	useEffect(() => {
		setColor(activeScreenItem.settings.color);
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
			<label className={`${styles.settingsLabel} screen-settings`}>Color</label>
			<button className={styles.colorPickerButton} onClick={() => setColorPickerVisible(true)} style={{ background: color }}></button>
			{colorPickerVisible && (
				<div className={styles.colorPickerContainer} ref={colorPickerContainerRef}>
					<SketchPicker
						className="colorpicker"
						color={color}
						onChange={(color) => {
							setColor(color.hex);
							updateScreenItemInState(activeScreen.orderIndex, activeScreenItem.orderIndex, {
								settings: {
									...activeScreenItem.settings,
									color: color.hex,
								},
							});
						}}
						onChangeComplete={(color) => {
							updateScreenItem(activeScreen.orderIndex, activeScreenItem.orderIndex, activeScreenItem.itemId, { settings: { ...activeScreenItem.settings, color: color.hex } });
							setActiveScreenItem({ ...activeScreenItem, settings: { ...activeScreenItem.settings, color: color.hex } });
						}}
					/>
					<div className={styles.customColorContainer}>
						<label>Custom Color</label>
						<input
							type="text"
							value={color}
							onChange={(e) => {
								setColor(e.target.value);
								updateScreenItemInState(activeScreen.orderIndex, activeScreenItem.orderIndex, {
									settings: {
										...activeScreenItem.settings,
										color: e.target.value,
									},
								});
							}}
						/>
					</div>
				</div>
			)}
		</div>
	);
}
