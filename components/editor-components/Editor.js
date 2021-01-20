import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import styles from "./Editor.module.scss";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Body from "./Body";

export default function Editor() {
	return (
		<>
			<div id="editor" className={styles.editor}>
				<Header />
				<DndProvider backend={HTML5Backend}>
					<Sidebar />
					<Body />
				</DndProvider>
			</div>
		</>
	);
}
