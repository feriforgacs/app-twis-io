import styles from "./Editor.module.scss";
import Header from "./Header";

export default function Editor() {
	return (
		<>
			<div id="editor" className={styles.editor}>
				<Header />
				<div id="editor__sidebar" className={styles.editor__sidebar}>
					<div id="sidebar__elements">elements</div>
					<div id="sidebar__element-options">element settings</div>
				</div>
				<div id="editor__body" className={styles.editor__body}></div>
			</div>
		</>
	);
}
