import { useContext, useState, useEffect, useRef } from "react";
import { SketchPicker } from "react-color";
import { GlobalContext } from "../../../../context/GlobalState";
import styles from "../ScreenSettings.module.scss";

export default function Background() {
	const { activeScreen, setActiveScreen, updateScreen, updateScreenInState } = useContext(GlobalContext);
	const [background, setBackground] = useState(activeScreen.background || "#ffffff");
	const [colorPickerVisible, setColorPickerVisible] = useState(false);

	const colorPickerContainerRef = useRef();

	const handleClickOutside = (e) => {
		if (!colorPickerContainerRef.current.contains(e.target)) {
			setColorPickerVisible(false);
		}
	};

	useEffect(() => {
		setBackground(activeScreen.background);
	}, [activeScreen]);

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
			<label className={`${styles.settingsLabel} screen-settings`}>Background</label>
			<button className={styles.colorPickerButton} onClick={() => setColorPickerVisible(true)} style={{ background }}></button>
			{colorPickerVisible && (
				<div className={styles.colorPickerContainer} ref={colorPickerContainerRef}>
					<SketchPicker
						className="colorpicker"
						color={background}
						onChange={(color) => {
							setBackground(color.hex);
							updateScreenInState(activeScreen.screenId, { background: color.hex });
						}}
						onChangeComplete={(color) => {
							updateScreen(activeScreen.screenId, { background: color.hex });
							setActiveScreen({ ...activeScreen, background: color.hex });
						}}
					/>
					<div className={styles.customColorContainer}>
						<label>Custom Background</label>
						<input
							type="text"
							value={background}
							onChange={(e) => {
								setBackground(e.target.value);
								updateScreenInState(activeScreen.screenId, { background: e.target.value });
							}}
						/>
					</div>
				</div>
			)}
		</div>
	);
}
