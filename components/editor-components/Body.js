import { useContext } from "react";
import { GlobalContext } from "../../context/GlobalState";
import styles from "./Body.module.scss";
import ScreenList from "./screen-components/ScreenList";

export default function Body() {
	const { resetActiveScreen } = useContext(GlobalContext);
	return (
		<div
			id="editor__body"
			className={styles.body}
			onMouseDown={(e) => {
				if (e.target && e.target.id === "editor__body") {
					resetActiveScreen();
				}
			}}
		>
			<ScreenList />
		</div>
	);
}
