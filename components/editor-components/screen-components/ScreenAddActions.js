import styles from "./Screen.module.scss";

export default function ScreenAddActions() {
	return (
		<div className={styles.addScreenActions}>
			<button className="button button--default-editor">+ Add info screen</button>
			<button className="button button--default-editor">+ Add question screen</button>
		</div>
	);
}
