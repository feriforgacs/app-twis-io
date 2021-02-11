import { useContext, useState, useEffect, useRef } from "react";
import { SketchPicker } from "react-color";
import { parse as GradientParser } from "gradient-parser";
import { GlobalContext } from "../../../../context/GlobalState";
import styles from "../ScreenSettings.module.scss";

export default function Background() {
	const { activeScreen, setActiveScreen, updateScreen, updateScreenInState } = useContext(GlobalContext);
	const [background, setBackground] = useState(activeScreen.background.color || "#ffffff");
	const [backgroundType, setBackgroundType] = useState(activeScreen.background.type || "solid");
	const [gradientStartColor, setGradientStartColor] = useState("#ffffff");
	const [gradientEndColor, setGradientEndColor] = useState("#eeeeee");
	const [colorPickerVisible, setColorPickerVisible] = useState(false);

	const colorPickerContainerRef = useRef();

	const handleClickOutside = (e) => {
		if (colorPickerContainerRef.current && !colorPickerContainerRef.current.contains(e.target)) {
			setColorPickerVisible(false);
		}
	};

	useEffect(() => {
		setBackground(activeScreen.background.color);

		if (activeScreen.background.color !== "solid") {
			const gradientSettings = GradientParser("linear-gradient(135.57deg, rgb(164, 38, 184) 0%, rgb(78, 156, 239) 93.45%)");

			setGradientStartColor(gradientSettings[0].colorStops[0]);
			setGradientEndColor(gradientSettings[0].colorStops[1]);
		} else {
			setGradientStartColor(activeScreen.background.color);
			setGradientEndColor(activeScreen.background.color);
		}
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
						<button className={`${styles.backgroundTypeTab} ${backgroundType === "solid" ? styles.backgroundTypeTabActive : ""}`} onClick={() => setBackgroundType("solid")}>
							Solid Color
						</button>

						<button className={`${styles.backgroundTypeTab} ${backgroundType === "gradient" ? styles.backgroundTypeTabActive : ""}`} onClick={() => setBackgroundType("gradient")}>
							Linear Gradient
						</button>
					</div>

					<div className={styles.gradientColors} style={{ background }}>
						<button className={styles.gradientColorsButton} style={{ background: gradientStartColor }}>
							start color
						</button>
						<button className={styles.gradientColorsButton} style={{ background: gradientEndColor }}>
							end color
						</button>
					</div>

					<SketchPicker
						disableAlpha={true}
						className="colorpicker"
						color={background}
						onChange={(color) => {
							setBackground(color.hex);
							updateScreenInState(activeScreen.screenId, { background: { type: "solid", color: color.hex } });
						}}
						onChangeComplete={(color) => {
							updateScreen(activeScreen.screenId, { background: { type: "solid", color: color.hex } });
							setActiveScreen({ ...activeScreen, background: { type: "solid", color: color.hex } });
						}}
					/>
				</div>
			)}
		</div>
	);
}
