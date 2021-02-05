import { useContext } from "react";
import { GlobalContext } from "../../../context/GlobalState";
import ReactSlider from "react-slider";
import styles from "./ScreenSettings.module.scss";

export default function ItemSettings() {
	const { activeScreen, activeScreenItem, updateScreenItem, updateScreenItemInState, setActiveScreenItem } = useContext(GlobalContext);
	return (
		<div className={`${styles.settings} item-settings`}>
			<div className={`${styles.settingsHeader} item-settings`}>
				Item Settings
				<button className={`${styles.settingsClose}`}>
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
						<line x1="18" y1="6" x2="6" y2="18"></line>
						<line x1="6" y1="6" x2="18" y2="18"></line>
					</svg>
				</button>
			</div>

			<div className={`${styles.settingsSection} item-settings`}>
				<label className={`${styles.settingsLabel} item-settings`}>Opacity</label>
				<ReactSlider
					defaultValue={activeScreenItem.settings.opacity || 100}
					className="horizontal-slider item-settings"
					thumbClassName="example-thumb item-settings"
					trackClassName="example-track item-settings"
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
		</div>
	);
}
