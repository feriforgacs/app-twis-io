import { useContext, useCallback, useEffect } from "react";
import { GlobalContext } from "../../../context/GlobalState";
import ReactTooltip from "react-tooltip";
import Image from "next/image";
import styles from "./ItemAdditionalActions.module.scss";

export default function ItemAdditionalActions() {
	const { activeScreenItem, activeScreen, removeScreenItem } = useContext(GlobalContext);

	/**
	 * Handle keydown events to delete screen item on backspace and delete
	 * @param {obj} event Keydown event object
	 */
	const handleKeyDown = useCallback(
		(event) => {
			// dont delete item if delete event happened in text input
			if (event.target && event.target.type && (event.target.type === "text" || event.target.type === "textarea")) {
				return;
			}

			if (event.keyCode && (event.keyCode === 8 || event.keyCode === 46)) {
				if (event.target.isContentEditable) {
					return;
				}
				event.preventDefault();
				// delete active screen item

				if (activeScreenItem.removeable !== false) {
					removeScreenItem(activeScreen.screenId, activeScreenItem.itemId);
				} else {
					alert("This item cannot be removed");
				}
			}
		},
		[activeScreenItem, removeScreenItem, activeScreen]
	);

	useEffect(() => {
		document.addEventListener("keydown", handleKeyDown, true);
		return () => {
			document.removeEventListener("keydown", handleKeyDown, true);
		};
	}, [handleKeyDown]);

	return (
		<>
			<div className={styles.additionalActions}>
				<button data-for="itemAction" data-tip="Delete item" className={`${styles.button} ${styles.buttonDelete}`} onClick={() => removeScreenItem(activeScreen.screenId, activeScreenItem.itemId)}>
					<Image src="/images/editor/icons/icon-delete.svg" width={18} height={18} alt="Delete item icon" title="Delete item" />
				</button>
			</div>
			<ReactTooltip id="itemAction" place="bottom" type="dark" effect="solid" getContent={(dataTip) => `${dataTip}`} />
		</>
	);
}
