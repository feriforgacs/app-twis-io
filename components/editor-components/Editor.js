import styles from "./Editor.module.scss";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Body from "./Body";

export default function Editor() {
	return (
		<>
			<div id="editor" className={styles.editor}>
				<Header />
				<Sidebar />
				<Body />
			</div>
		</>
	);
}
