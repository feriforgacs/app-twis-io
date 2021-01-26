import styles from "../screen-components/Screen.module.scss";

export default function SkeletonScreen() {
	return (
		<div className={styles.screen}>
			<div className={styles.screenActions}>
				<span className="skeleton skeleton--text"></span>
			</div>
			<div className={`${styles.screenBody} skeleton skeleton--screen`}></div>
		</div>
	);
}
