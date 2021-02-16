import { useContext } from "react";
import ReactTooltip from "react-tooltip";
import styles from "../Screen.module.scss";
import Image from "next/image";
import { GlobalContext } from "../../../../context/GlobalState";

export default function Order({ screen }) {
	const { screens, updateScreenOrder } = useContext(GlobalContext);
	return (
		<>
			<button data-for="screenAction" data-tip="Move up" disabled={screen.orderIndex === 1} className={`${styles.buttonScreen} ${styles.buttonScreenMoveUp}`} onClick={() => updateScreenOrder(screen.screenId, "up")}>
				<Image src="/images/editor/icons/icon-move-up.svg" width={18} height={18} alt="Move screen up icon" title="Move up" />
			</button>

			<button data-for="screenAction" data-tip="Move down" disabled={screen.orderIndex === screens.length - 3} className={`${styles.buttonScreen} ${styles.buttonScreenMoveDown}`} onClick={() => updateScreenOrder(screen.screenId, "down")}>
				<Image src="/images/editor/icons/icon-move-down.svg" width={18} height={18} alt="Move screen down icon" title="Move down" />
			</button>
			<ReactTooltip id="screenAction" place="bottom" type="dark" effect="solid" getContent={(dataTip) => `${dataTip}`} />
		</>
	);
}
