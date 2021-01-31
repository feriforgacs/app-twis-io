import { useContext } from "react";
import ReactTooltip from "react-tooltip";
import styles from "./Screen.module.scss";
import Image from "next/image";
import { GlobalContext } from "../../../context/GlobalState";

export default function ScreenAdditionalActions({ screenId }) {
	const { removeScreen } = useContext(GlobalContext);
	return (
		<>
			<div className={styles.screenAdditionalActions}>
				<button data-for="screenAction" data-tip="Move up" className={`${styles.buttonScreen} ${styles.buttonScreenMoveUp}`}>
					<Image src="/images/editor/icons/icon-move-up.svg" width={18} height={18} alt="Move screen up icon" title="Move up" />
				</button>

				<button data-for="screenAction" data-tip="Move down" className={`${styles.buttonScreen} ${styles.buttonScreenMoveDown}`}>
					<Image src="/images/editor/icons/icon-move-down.svg" width={18} height={18} alt="Move screen down icon" title="Move down" />
				</button>

				<button data-for="screenAction" data-tip="Duplicate screen" className={`${styles.buttonScreen} ${styles.buttonScreenDuplicate}`}>
					<Image src="/images/editor/icons/icon-duplicate.svg" width={18} height={18} alt="Duplicate screen icon" title="Duplicate screen" />
				</button>

				<button data-for="screenAction" data-tip="Delete screen" className={`${styles.buttonScreen} ${styles.buttonScreenDelete}`} onClick={() => removeScreen(screenId)}>
					<Image src="/images/editor/icons/icon-delete.svg" width={18} height={18} alt="Delete screen icon" title="Delete screen" />
				</button>
			</div>
			<ReactTooltip id="screenAction" place="bottom" type="dark" effect="solid" getContent={(dataTip) => `${dataTip}`} />
		</>
	);
}
