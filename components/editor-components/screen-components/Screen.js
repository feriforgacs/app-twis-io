import styles from "./Screen.module.scss";
import Image from "next/image";

export default function Screen() {
	return (
		<div className={styles.screen}>
			<div className={styles.screenActions}>
				<button className={`${styles.buttonScreen} ${styles.buttonScreenSettings}`}>
					<Image src="/images/editor/icons/icon-cog.svg" width={20} height={20} alt="Screen settings icon" />
					<span className={styles.buttonLabel}>Start screen</span>
				</button>
			</div>
			<div className={`${styles.screenBody}`}>body</div>
		</div>
	);
}
