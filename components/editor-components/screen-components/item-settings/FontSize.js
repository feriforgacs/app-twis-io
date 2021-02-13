import { useContext, useState, useRef, useEffect } from "react";
import { GlobalContext } from "../../../../context/GlobalState";
import styles from "../ScreenSettings.module.scss";
import { DebounceInput } from "react-debounce-input";
import FontSizeOptions from "../../../../utils/FontSizeOptions";

export default function FontSize() {
	const { activeScreen, activeScreenItem, setActiveScreenItem, updateScreenItem } = useContext(GlobalContext);
	const [fontSize, setFontSize] = useState(activeScreenItem.settings.fontSize);
	const [fontSizeSelectorVisible, setFontSizeSelectorVisible] = useState(false);

	const fontSizeSelectorRef = useRef();

	/**
	 * Update font size of active screen item
	 */
	useEffect(() => {
		setFontSize(activeScreenItem.settings.fontSize);
	}, [activeScreenItem]);

	/**
	 * Close font size selector on click outside
	 * @param {obj} e Click event object
	 */
	const handleClickOutside = (e) => {
		if (!fontSizeSelectorRef.current.contains(e.target)) {
			setFontSizeSelectorVisible(false);
		}
	};

	/**
	 * Close font size selector on click outside
	 */
	useEffect(() => {
		if (fontSizeSelectorVisible) {
			document.addEventListener("mousedown", handleClickOutside);
		} else {
			document.removeEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [fontSizeSelectorVisible]);

	return (
		<div className={`${styles.settingsSection} item-settings`}>
			<label className={`${styles.settingsLabel} item-settings`}>Font Size</label>
			<div className={`${styles.fontSizeSelector} item-settings`}>
				<DebounceInput
					type="number"
					className={`item-settings ${styles.fontSizeInput}`}
					value={fontSize}
					debounceTimeout="300"
					onChange={(e) => {
						const fontSize = parseInt(e.target.value);
						updateScreenItem(activeScreen.screenId, activeScreenItem.itemId, { settings: { ...activeScreenItem.settings, fontSize: fontSize } });
						setActiveScreenItem({ ...activeScreenItem, settings: { ...activeScreenItem.settings, fontSize: fontSize } });
					}}
					onFocus={() => setFontSizeSelectorVisible(true)}
				/>
				{fontSizeSelectorVisible && (
					<ul className={styles.fontSizeSelectorList} ref={fontSizeSelectorRef}>
						{FontSizeOptions.map((size) => (
							<li
								key={size}
								className={`${styles.fontSizeSelectorListItem} ${fontSize === size ? styles.fontSizeSelectorListItemSelected : ""}`}
								onClick={() => {
									setFontSize(size);
									updateScreenItem(activeScreen.screenId, activeScreenItem.itemId, { settings: { ...activeScreenItem.settings, fontSize: size } });
									setActiveScreenItem({ ...activeScreenItem, settings: { ...activeScreenItem.settings, fontSize: size } });
									setFontSizeSelectorVisible(false);
								}}
							>
								{size}
								{fontSize === size && (
									<span className={styles.fontFamilyListSelected}>
										<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#159c5b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
											<polyline points="20 6 9 17 4 12"></polyline>
										</svg>
									</span>
								)}
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	);
}
