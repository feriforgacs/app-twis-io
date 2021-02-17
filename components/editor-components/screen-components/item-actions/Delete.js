import { useContext, useCallback, useEffect } from "react";
import { GlobalContext } from "../../../../context/GlobalState";
import ReactTooltip from "react-tooltip";
import Image from "next/image";
import styles from "../ItemAdditionalActions.module.scss";

export default function Delete() {
	const { activeScreenItem, activeScreen, removeScreenItem } = useContext(GlobalContext);

	/**
	 * Handle keydown events to delete screen item on backspace and delete
	 * @param {obj} event Keydown event object
	 */
	const handleKeyDown = useCallback(
		(event) => {
			const keyCode = event.keyCode || event.which;

			// dont delete item if delete event happened in text input
			if (event.target && event.target.type && (event.target.type === "text" || event.target.type === "textarea" || event.target.type === "url" || event.target.type === "email" || event.target.type === "number")) {
				return;
			}

			if (keyCode === 8 || keyCode === 46) {
				if (event.target.isContentEditable) {
					return;
				}
				event.preventDefault();
				// delete active screen item

				if (activeScreenItem.settings.removeable !== false) {
					removeScreenItem(activeScreen.screenId, activeScreenItem.itemId);
				} else {
					let itemType = "This item";
					switch (activeScreenItem.type) {
						case "question":
							itemType = "Questions";
							break;

						case "answers":
							itemType = "Answers";
							break;

						case "form":
							itemType = "Forms";
							break;

						default:
							break;
					}
					alert(`${itemType} cannot be removed`);
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
			{activeScreenItem.type !== "question" && (
				<>
					<button data-for="itemAction" data-tip="Delete item" className={`${styles.button} ${styles.buttonDelete}`} onClick={() => removeScreenItem(activeScreen.screenId, activeScreenItem.itemId)}>
						<Image src="/images/editor/icons/icon-delete.svg" width={18} height={18} alt="Delete item icon" title="Delete item" />
					</button>
					<ReactTooltip id="itemAction" place="bottom" type="dark" effect="solid" getContent={(dataTip) => `${dataTip}`} />
				</>
			)}
		</>
	);
}
