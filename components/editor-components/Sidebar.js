import styles from "./Sidebar.module.scss";

export default function Sidebar() {
	return (
		<div id="editor__sidebar" className={styles.sidebar}>
			<div id="sidebar__elements">elements</div>
			<div id="sidebar__element-options">element settings</div>
		</div>
	);
}
