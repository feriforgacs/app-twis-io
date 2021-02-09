import { useContext, useState, useRef, useEffect } from "react";
import { GlobalContext } from "../../../../context/GlobalState";
import styles from "../ScreenSettings.module.scss";
import FontFamilies from "../../../../utils/FontFamilies";

export default function Font() {
	const { activeScreen, activeScreenItem, setActiveScreenItem, updateScreenItem, updateCampaignFonts } = useContext(GlobalContext);
	const [fontFamily, setFontFamily] = useState(activeScreenItem.settings.fontFamily || "arial");
	const [fontSelectorVisible, setFontSelectorVisible] = useState(false);

	const fontFamilySelectorRef = useRef();

	/**
	 * Update font family of active screen item
	 */
	useEffect(() => {
		setFontFamily(activeScreenItem.settings.fontFamily || "arial");
	}, [activeScreenItem]);

	/**
	 * Close font family selector on click outside
	 * @param {obj} e Click event object
	 */
	const handleClickOutside = (e) => {
		if (!fontFamilySelectorRef.current.contains(e.target)) {
			setFontSelectorVisible(false);
		}
	};

	/**
	 * Close font family selector on click outside
	 */
	useEffect(() => {
		if (fontSelectorVisible) {
			document.addEventListener("mousedown", handleClickOutside);
		} else {
			document.removeEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [fontSelectorVisible]);

	return (
		<div className={`${styles.settingsSection} item-settings`}>
			<label className={`${styles.settingsLabel} item-settings`}>Font</label>
			<div className={styles.fontFamilySelector}>
				<span className={styles.fontFamilySelected} onClick={() => setFontSelectorVisible(true)}>
					<img src={`/images/editor/fonts/font-${FontFamilies[fontFamily].key}.svg`} alt={FontFamilies[fontFamily].name} />
				</span>
				{fontSelectorVisible && (
					<ul className={styles.fontFamilySelectorList} ref={fontFamilySelectorRef}>
						{Object.keys(FontFamilies).map((font) => (
							<li
								key={FontFamilies[font].key}
								onClick={() => {
									setFontFamily(font);
									updateScreenItem(activeScreen.orderIndex, activeScreenItem.orderIndex, activeScreenItem.itemId, { settings: { ...activeScreenItem.settings, fontFamily: font } });
									setActiveScreenItem({ ...activeScreenItem, settings: { ...activeScreenItem.settings, fontFamily: font } });
									updateCampaignFonts(font);
								}}
							>
								<img src={`/images/editor/fonts/font-${FontFamilies[font].key}.svg`} alt={FontFamilies[font].name} />
								{fontFamily === font && (
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
