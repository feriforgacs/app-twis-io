import { useContext } from "react";
import { GlobalContext } from "../../../../context/GlobalState";
import ReactTooltip from "react-tooltip";
import Image from "next/image";
import styles from "../ItemAdditionalActions.module.scss";

export default function Position() {
	const { activeScreenItem, activeScreen, updateItemOrder } = useContext(GlobalContext);
	/**
	 * @todo - set active screen item on activescreenitem change
	 */
	return (
		<>
			<button data-for="itemAction" data-tip="Bring to front" className={`${styles.button} ${styles.buttonPosition}`} onClick={() => updateItemOrder(activeScreen.screenId, activeScreenItem.itemId, "front")}>
				<Image src="/images/editor/icons/icon-to-front.svg" width={18} height={18} alt="To front icon" title="To front" />
			</button>

			<button data-for="itemAction" data-tip="Bring forward" className={`${styles.button} ${styles.buttonPosition}`} onClick={() => updateItemOrder(activeScreen.screenId, activeScreenItem.itemId, "forward")}>
				<Image src="/images/editor/icons/icon-forward.svg" width={18} height={18} alt="Forward icon" title="Forward" />
			</button>

			<button data-for="itemAction" data-tip="Send backward" className={`${styles.button} ${styles.buttonPosition}`} onClick={() => updateItemOrder(activeScreen.screenId, activeScreenItem.itemId, "backward")}>
				<Image src="/images/editor/icons/icon-backward.svg" width={18} height={18} alt="Backward icon" title="Backward" />
			</button>

			<button data-for="itemAction" data-tip="Send to back" className={`${styles.button} ${styles.buttonPosition}`} onClick={() => alert("To back")}>
				<Image src="/images/editor/icons/icon-to-back.svg" width={18} height={18} alt="To back icon" title="To back" />
			</button>
			<ReactTooltip id="itemAction" place="bottom" type="dark" effect="solid" getContent={(dataTip) => `${dataTip}`} />
		</>
	);
}
