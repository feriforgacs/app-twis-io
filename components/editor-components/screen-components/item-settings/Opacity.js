import { useContext } from "react";
import { GlobalContext } from "../../../../context/GlobalState";
import ReactSlider from "react-slider";
import styles from "../ScreenSettings.module.scss";

export default function Opacity() {
	const { activeScreen, activeScreenItem, updateScreenItem, updateScreenItemInState, setActiveScreenItem } = useContext(GlobalContext);
	let itemOpacity = 100;
	if (activeScreenItem.settings.opacity || activeScreenItem.settings.opacity === 0) {
		itemOpacity = activeScreenItem.settings.opacity * 100;
	}

	return (
		<div className={`${styles.settingsSection} item-settings`}>
			<label className={`${styles.settingsLabel} item-settings`}>Opacity</label>
			<ReactSlider
				defaultValue={itemOpacity}
				value={itemOpacity}
				className="horizontal-slider item-settings"
				thumbClassName="horizontal-slider__thumb item-settings"
				trackClassName="horizontal-slider__track item-settings"
				onAfterChange={(value) => {
					const opacity = value / 100;
					// update screen item data in state and save to the db
					updateScreenItem(activeScreen.orderIndex, activeScreenItem.orderIndex, activeScreenItem.itemId, {
						settings: {
							...activeScreenItem.settings,
							opacity,
						},
					});

					// update active screen item settings to properly set new values for upcoming changes
					setActiveScreenItem({
						...activeScreenItem,
						settings: {
							...activeScreenItem.settings,
							opacity,
						},
					});
				}}
				onChange={(value) => {
					const opacity = value / 100;
					// update screen item data in state for live preview
					updateScreenItemInState(activeScreen.orderIndex, activeScreenItem.orderIndex, {
						settings: {
							...activeScreenItem.settings,
							opacity,
						},
					});
				}}
				renderThumb={(props, state) => (
					<div className="item-settings" {...props}>
						{state.valueNow}
					</div>
				)}
			/>
		</div>
	);
}
