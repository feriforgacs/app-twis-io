import styles from "./Body.module.scss";
import ScreenList from "./screen-components/ScreenList";

export default function Body() {
	return (
		<div id="editor__body" className={styles.body}>
			<ScreenList />
		</div>
	);
}
