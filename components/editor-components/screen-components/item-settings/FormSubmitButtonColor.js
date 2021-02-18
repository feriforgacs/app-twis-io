import { useContext, useState, useEffect, useRef } from "react";
import { SketchPicker } from "react-color";
import { GlobalContext } from "../../../../context/GlobalState";
import styles from "../ScreenSettings.module.scss";

export default function FormSubmitButtonColor() {
	const { activeScreen, activeScreenItem, setActiveScreenItem, updateScreenItem, updateScreenItemInState } = useContext(GlobalContext);

	const [color, setColor] = useState(
		activeScreenItem.settings.colorButton || {
			r: 51,
			g: 51,
			b: 51,
			a: 1,
		}
	);
	const [colorPickerVisible, setColorPickerVisible] = useState(false);

	/**
	 * Update settings on active item change
	 */
	useEffect(() => {
		setColor(activeScreenItem.settings.colorButton);
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
			<label className={`${styles.settingsLabel} screen-settings`}>Form Button Color</label>
			<button className={styles.colorPickerButton} onClick={() => setColorPickerVisible(true)} style={{ background: `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})` }}></button>
			{colorPickerVisible && (
				<div className={styles.colorPickerContainer} ref={colorPickerContainerRef}>
					<SketchPicker
						className="colorpicker"
						color={color}
						onChange={(color) => {
							setColor(color.rgb);
							updateScreenItemInState(activeScreen.screenId, activeScreenItem.itemId, {
								settings: {
									...activeScreenItem.settings,
									colorButton: color.rgb,
								},
							});
						}}
						onChangeComplete={(color) => {
							updateScreenItem(activeScreen.screenId, activeScreenItem.itemId, { settings: { ...activeScreenItem.settings, colorButton: color.rgb } });
							setActiveScreenItem({ ...activeScreenItem, settings: { ...activeScreenItem.settings, colorButton: color.rgb } });
						}}
					/>
				</div>
			)}
		</div>
	);
}
