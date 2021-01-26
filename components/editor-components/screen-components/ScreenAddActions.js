import { v4 as uuidv4 } from "uuid";
import { useContext } from "react";
import { GlobalContext } from "../../../context/GlobalState";
import styles from "./Screen.module.scss";

export default function ScreenAddActions() {
	const { addScreen } = useContext(GlobalContext);

	const addNewScreen = (type) => {
		const newScreenId = uuidv4();
		addScreen(type, newScreenId);
	};
	return (
		<div className={styles.addScreenActions}>
			<button className="button button--default-editor" onClick={() => addNewScreen("info")}>
				+ Add info screen
			</button>
			<button className="button button--default-editor" onClick={() => addNewScreen("question")}>
				+ Add question screen
			</button>
		</div>
	);
}
