import { useContext, useState, useEffect } from "react";
import ReactTooltip from "react-tooltip";
import { GlobalContext } from "../../../../context/GlobalState";
import styles from "../ScreenSettings.module.scss";

export default function FontStyle() {
	const { activeScreen, activeScreenItem, setActiveScreenItem, updateScreenItem } = useContext(GlobalContext);

	const [bold, setBold] = useState(activeScreenItem.settings.bold || false);
	const [italic, setItalic] = useState(activeScreenItem.settings.italic || false);
	const [underline, setUnderline] = useState(activeScreenItem.settings.underline || false);
	const [uppercase, setUppercase] = useState(activeScreenItem.settings.uppercase || false);

	/**
	 * Update settings on active item change
	 */
	useEffect(() => {
		setBold(activeScreenItem.settings.bold);
		setItalic(activeScreenItem.settings.italic);
		setUnderline(activeScreenItem.settings.underline);
		setUppercase(activeScreenItem.settings.uppercase);
	}, [activeScreenItem]);

	return (
		<div className={`${styles.settingsSection} item-settings`}>
			<div className={`${styles.fontStyleSettings} item-settings`}>
				<button
					data-for="fontStyle"
					data-tip="Bold"
					className={`${styles.fontStyleButton} ${bold ? styles.fontStyleButtonActive : ""}`}
					onClick={() => {
						setBold(!bold);
						updateScreenItem(activeScreen.orderIndex, activeScreenItem.orderIndex, activeScreenItem.itemId, { settings: { ...activeScreenItem.settings, bold: !bold } });
						setActiveScreenItem({ ...activeScreenItem, settings: { ...activeScreenItem.settings, bold: !bold } });
					}}
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
						<path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
						<path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
					</svg>
				</button>

				<button
					data-for="fontStyle"
					data-tip="Italic"
					className={`${styles.fontStyleButton} ${italic ? styles.fontStyleButtonActive : ""}`}
					onClick={() => {
						setItalic(!italic);
						updateScreenItem(activeScreen.orderIndex, activeScreenItem.orderIndex, activeScreenItem.itemId, { settings: { ...activeScreenItem.settings, italic: !italic } });
						setActiveScreenItem({ ...activeScreenItem, settings: { ...activeScreenItem.settings, italic: !italic } });
					}}
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
						<path d="M19 4h-9M14 20H5M14.7 4.7L9.2 19.4" />
					</svg>
				</button>

				<button
					data-for="fontStyle"
					data-tip="Underline"
					className={`${styles.fontStyleButton} ${underline ? styles.fontStyleButtonActive : ""}`}
					onClick={() => {
						setUnderline(!underline);
						updateScreenItem(activeScreen.orderIndex, activeScreenItem.orderIndex, activeScreenItem.itemId, { settings: { ...activeScreenItem.settings, underline: !underline } });
						setActiveScreenItem({ ...activeScreenItem, settings: { ...activeScreenItem.settings, underline: !underline } });
					}}
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
						<path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"></path>
						<line x1="4" y1="21" x2="20" y2="21"></line>
					</svg>
				</button>

				<button
					data-for="fontStyle"
					data-tip="Uppercase"
					className={`${styles.fontStyleButton} ${uppercase ? styles.fontStyleButtonActive : ""}`}
					onClick={() => {
						setUppercase(!uppercase);
						updateScreenItem(activeScreen.orderIndex, activeScreenItem.orderIndex, activeScreenItem.itemId, { settings: { ...activeScreenItem.settings, uppercase: !uppercase } });
						setActiveScreenItem({ ...activeScreenItem, settings: { ...activeScreenItem.settings, uppercase: !uppercase } });
					}}
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
						<path fill="#000000" d="M8.77 19l-.29-1.37h-.07c-.48.6-.96 1.01-1.44 1.22-.47.22-1.07.33-1.79.33-.95 0-1.7-.25-2.24-.74-.54-.5-.81-1.2-.81-2.1 0-1.95 1.55-2.97 4.66-3.06l1.64-.05v-.6c0-.76-.17-1.32-.5-1.68-.32-.36-.84-.54-1.55-.54-.8 0-1.71.25-2.73.74l-.44-1.11a6.86 6.86 0 0 1 3.26-.83c1.15 0 2 .25 2.55.76.55.51.83 1.33.83 2.46V19H8.77zm-3.3-1.03c.91 0 1.63-.25 2.14-.75.52-.5.78-1.2.78-2.09v-.87l-1.46.06a5.3 5.3 0 0 0-2.5.54c-.52.32-.78.82-.78 1.5 0 .52.16.92.48 1.2.32.27.77.41 1.34.41zM21.15 19l-1.6-4.09H14.4L12.82 19h-1.51l5.08-12.9h1.26L22.7 19h-1.55zm-2.06-5.43l-1.5-3.98c-.19-.5-.39-1.13-.6-1.86-.12.56-.3 1.18-.55 1.86l-1.5 3.98h4.15z"></path>
					</svg>
				</button>
			</div>

			<ReactTooltip id="fontStyle" place="bottom" type="dark" effect="solid" getContent={(dataTip) => `${dataTip}`} />
		</div>
	);
}
