import styles from "./Screen.module.scss";
import Image from "next/image";
import ReactTooltip from "react-tooltip";

export default function Screen({ type = "question" }) {
	return (
		<div className={styles.screen}>
			<div className={styles.screenActions}>
				<button className={`${styles.buttonScreen} ${styles.buttonScreenSettings}`}>
					<Image src="/images/editor/icons/icon-cog.svg" width={18} height={18} alt="Screen settings icon" />
					<span className={styles.buttonLabel}>Start screen</span>
				</button>
				{type === "question" || type === "info" ? (
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

							<button data-for="screenAction" data-tip="Delete screen" className={`${styles.buttonScreen} ${styles.buttonScreenDelete}`}>
								<Image src="/images/editor/icons/icon-delete.svg" width={18} height={18} alt="Delete screen icon" title="Delete screen" />
							</button>
						</div>
						<ReactTooltip id="screenAction" place="bottom" type="dark" effect="solid" getContent={(dataTip) => `${dataTip}`} />
					</>
				) : (
					""
				)}
			</div>
			<div className={`${styles.screenBody}`}>body</div>
		</div>
	);
}
