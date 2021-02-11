import { useContext, useState, useEffect, useRef } from "react";
import { SketchPicker } from "react-color";
import { parse as GradientParser } from "gradient-parser";
import { GlobalContext } from "../../../../context/GlobalState";
import styles from "../ScreenSettings.module.scss";

export default function Background() {
	const { activeScreen, setActiveScreen, updateScreen, updateScreenInState } = useContext(GlobalContext);
	const [background, setBackground] = useState(activeScreen.background.color || "#ffffff");
	const [backgroundType, setBackgroundType] = useState(activeScreen.background.type || "solid");

	const [gradientColorPicker, setGradientColorPicker] = useState("start");
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

			setGradientStartColor(`rgb(${gradientSettings[0].colorStops[0].value[0]}, ${gradientSettings[0].colorStops[0].value[1]}, ${gradientSettings[0].colorStops[0].value[2]})`);

			setGradientEndColor(`rgb(${gradientSettings[0].colorStops[1].value[0]}, ${gradientSettings[0].colorStops[1].value[1]}, ${gradientSettings[0].colorStops[1].value[2]})`);
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

					{backgroundType === "gradient" && (
						<div className={styles.gradientColors} style={{ background }}>
							<button className={`${styles.gradientColorsButton} ${gradientColorPicker === "start" ? styles.gradientColorsButtonActive : ""}`} style={{ background: gradientStartColor }} onClick={() => setGradientColorPicker("start")}>
								start
							</button>

							<button className={`${styles.gradientColorsButton} ${gradientColorPicker === "end" ? styles.gradientColorsButtonActive : ""}`} style={{ background: gradientEndColor }} onClick={() => setGradientColorPicker("end")}>
								end
							</button>
						</div>
					)}

					<SketchPicker
						disableAlpha={true}
						className="colorpicker"
						color={backgroundType === "solid" ? background : gradientColorPicker === "start" ? gradientStartColor : gradientEndColor}
						onChange={(color) => {
							let backgroundColor;
							if (backgroundType === "solid") {
								backgroundColor = color.hex;
							} else {
								if (gradientColorPicker === "start") {
									// set gradient start color
									setGradientStartColor(`rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`);
									backgroundColor = `linear-gradient(rgb(${color.rgb}), ${gradientEndColor})`;
								} else {
									// set gradient end color
									setGradientEndColor(`rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`);
									backgroundColor = `linear-gradient(${gradientStartColor}, rgb(${color.rgb}))`;
								}
							}
							setBackground(backgroundColor);
							updateScreenInState(activeScreen.screenId, { background: { type: backgroundType, color: backgroundColor } });
						}}
						onChangeComplete={(color) => {
							let backgroundColor;
							if (backgroundType === "solid") {
								backgroundColor = color.hex;
							} else {
								if (gradientColorPicker === "start") {
									// set gradient start color
									setGradientStartColor(`rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`);
									backgroundColor = `linear-gradient(rgb(${color.rgb}), ${gradientEndColor})`;
								} else {
									// set gradient end color
									setGradientEndColor(`rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`);
									backgroundColor = `linear-gradient(${gradientStartColor}, rgb(${color.rgb}))`;
								}
							}
							updateScreen(activeScreen.screenId, { background: { type: backgroundType, color: backgroundColor } });
							setActiveScreen({ ...activeScreen, background: { type: backgroundType, color: backgroundColor } });
						}}
					/>
				</div>
			)}
		</div>
	);
}
