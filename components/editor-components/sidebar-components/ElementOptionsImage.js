import styles from "./ElementOptions.module.scss";

export default function ElementOptionsImage() {
	return (
		<div className={styles.elementOptions}>
			<div className={styles.tabs}>
				<div className={`${styles.tab} ${styles.tabActive}`}>Media library</div>
				<div className={styles.tab}>Free stocks</div>
				<div className={styles.tab}>GIFs</div>
			</div>
		</div>
	);
}
