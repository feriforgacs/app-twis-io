import { useContext } from "react";
import { GlobalContext } from "../../../context/GlobalState";
import ReactTooltip from "react-tooltip";
import Image from "next/image";
import styles from "./ItemAdditionalActions.module.scss";

export default function ItemAdditionalActions() {
	const { activeScreenItem, activeScreen, removeScreenItem } = useContext(GlobalContext);
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
