import { useContext, useState, useEffect, useRef } from "react";
import { SketchPicker } from "react-color";
import { GlobalContext } from "../../../../context/GlobalState";
import styles from "../ScreenSettings.module.scss";
import GradientPicker from "./GradientPicker";

export default function Background() {
	const { activeScreen, setActiveScreen, updateScreen, updateScreenInState } = useContext(GlobalContext);
	const [background, setBackground] = useState(activeScreen.background.color || "#ffffff");
	const [backgroundType, setBackgroundType] = useState(activeScreen.background.type || "solid");

	const [colorPickerVisible, setColorPickerVisible] = useState(false);

	const colorPickerContainerRef = useRef();

	const handleClickOutside = (e) => {
		if (colorPickerContainerRef.current && !colorPickerContainerRef.current.contains(e.target)) {
			setColorPickerVisible(false);
		}
	};

	useEffect(() => {
		setBackground(activeScreen.background.color);
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
					<div className={styles.backgroundTypeTabs}>
						<button
							className={`${styles.backgroundTypeTab} ${backgroundType === "solid" ? styles.backgroundTypeTabActive : ""}`}
							onClick={
								() => setBackgroundType("solid")
								/**
								 * @todo update current background type and colors in state and db
								 */
							}
						>
							Solid
						</button>

						<button
							className={`${styles.backgroundTypeTab} ${backgroundType === "gradient" ? styles.backgroundTypeTabActive : ""}`}
							onClick={
								() => setBackgroundType("gradient")
								/**
								 * @todo update current background type and colors in state and db
								 */
							}
						>
							Gradient
						</button>
					</div>

					{backgroundType === "solid" && (
						<SketchPicker
							disableAlpha={true}
							className="colorpicker"
							color={background}
							onChange={(color) => {
								setBackground(color.hex);
								updateScreenInState(activeScreen.screenId, { background: { type: backgroundType, color: color.hex } });
							}}
							onChangeComplete={(color) => {
								updateScreen(activeScreen.screenId, { background: { type: backgroundType, color: color.hex } });
								setActiveScreen({ ...activeScreen, background: { type: backgroundType, color: color.hex } });
							}}
						/>
					)}

					{backgroundType === "gradient" && (
						<GradientPicker
							onSelect={(gradient) => {
								setBackground(gradient);
								updateScreen(activeScreen.screenId, { background: { type: backgroundType, color: gradient } });
								setActiveScreen({ ...activeScreen, background: { type: backgroundType, color: gradient } });
							}}
						/>
					)}
				</div>
			)}
		</div>
	);
}
