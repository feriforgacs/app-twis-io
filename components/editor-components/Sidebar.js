import { useState } from "react";
import styles from "./Sidebar.module.scss";
import Element from "./sidebar-components/Element";
import ElementOptionsText from "./sidebar-components/ElementOptionsText";

export default function Sidebar() {
	const [activeElement, setActiveElement] = useState("text");

	return (
		<div id="editor__sidebar" className={styles.sidebar}>
			<div id="sidebar__elements" className={styles.sidebarElements}>
				<Element icon="text" label="Text" active={activeElement === "text"} onClick={() => setActiveElement("text")} />
				<Element icon="image" label="Image" active={activeElement === "image"} onClick={() => setActiveElement("image")} />
				<Element icon="sticker" label="Sticker" active={activeElement === "sticker"} onClick={() => setActiveElement("sticker")} />
			</div>
			<div id="sidebar__element-options" className={styles.sidebarElementOptions}>
				<p>Drag and drop items to the screens</p>
				{activeElement === "text" && <ElementOptionsText />}
			</div>
		</div>
	);
}
