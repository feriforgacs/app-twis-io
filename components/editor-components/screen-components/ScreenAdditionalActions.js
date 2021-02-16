import ReactTooltip from "react-tooltip";
import styles from "./Screen.module.scss";
import Image from "next/image";
import Duplicate from "./screen-actions/Duplicate";
import Delete from "./screen-actions/Delete";

export default function ScreenAdditionalActions({ screen }) {
	return (
		<>
			<div className={styles.screenAdditionalActions} id={`screen-additional-actions--${screen.screenId}`}>
				<button data-for="screenAction" data-tip="Move up" className={`${styles.buttonScreen} ${styles.buttonScreenMoveUp}`}>
					<Image src="/images/editor/icons/icon-move-up.svg" width={18} height={18} alt="Move screen up icon" title="Move up" />
				</button>

				<button data-for="screenAction" data-tip="Move down" className={`${styles.buttonScreen} ${styles.buttonScreenMoveDown}`}>
					<Image src="/images/editor/icons/icon-move-down.svg" width={18} height={18} alt="Move screen down icon" title="Move down" />
				</button>

				<Duplicate screen={screen} />
				<Delete screen={screen} />
			</div>
			<ReactTooltip id="screenAction" place="bottom" type="dark" effect="solid" getContent={(dataTip) => `${dataTip}`} />
		</>
	);
}
