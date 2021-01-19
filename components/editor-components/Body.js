import styles from "./Body.module.scss";
import Screen from "./screen-components/Screen";

export default function Body() {
	return (
		<div id="editor__body" className={styles.body}>
			<Screen />
		</div>
	);
}
