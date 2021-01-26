import styles from "./Screen.module.scss";
import Image from "next/image";
import ReactTooltip from "react-tooltip";
import ScreenAddActions from "./ScreenAddActions";

export default function Screen({ screen }) {
	const screenTypeNames = {
		start: "Start Screen",
		endSuccess: "End Screen Success",
		endFailure: "End Screen Failure",
		question: "Question Screen",
		info: "Info Screen",
	};
	return (
		<>
			{screen.type === "endSuccess" && <ScreenAddActions />}
			<div className={styles.screen}>
				<div className={styles.screenActions}>
					<button className={`${styles.buttonScreen} ${styles.buttonScreenSettings}`}>
						<Image src="/images/editor/icons/icon-cog.svg" width={18} height={18} alt="Screen settings icon" />
						<span className={styles.buttonLabel}>{screenTypeNames[screen.type]}</span>
					</button>
					{screen.type === "question" || screen.type === "info" ? (
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
		</>
	);
}
