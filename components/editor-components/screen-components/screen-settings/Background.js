import { useContext, useState } from "react";
import { SketchPicker } from "react-color";
import { GlobalContext } from "../../../../context/GlobalState";
import styles from "../ScreenSettings.module.scss";

export default function Background() {
	const { activeScreen, setActiveScreen, updateScreen, updateScreenInState } = useContext(GlobalContext);
	const [background, setBackground] = useState(activeScreen.background || "#ffffff");
	const [colorPickerVisible, setColorPickerVisible] = useState(false);
	return (
		<div className={`${styles.settingsSection} item-settings`}>
			<label className={`${styles.settingsLabel} item-settings`}>Background</label>
			<button className={styles.colorPickerButton} onClick={() => setColorPickerVisible(!colorPickerVisible)}></button>
			{colorPickerVisible && (
				<SketchPicker
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
			)}
		</div>
	);
}
