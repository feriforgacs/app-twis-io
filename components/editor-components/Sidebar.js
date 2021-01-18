import styles from "./Sidebar.module.scss";
import Element from "./sidebar-components/Element";

export default function Sidebar() {
	return (
		<div id="editor__sidebar" className={styles.sidebar}>
			<div id="sidebar__elements" className={styles.sidebarElements}>
				<Element icon="text" label="Text" />
				<Element icon="image" label="Image" />
				<Element icon="sticker" label="Sticker" />
			</div>
			<div id="sidebar__element-options" className={styles.sidebarElementOptions}>
				element settings
			</div>
		</div>
	);
}
