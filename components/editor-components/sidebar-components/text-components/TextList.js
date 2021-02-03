import styles from "../ElementOptions.module.scss";
import TextTemplates from "../../../../utils/TextTemplates";
import Text from "./Text";
export default function TextList({ active = false }) {
	return (
		<div className={`${styles.elementOptions} ${!active ? "hidden" : ""}`}>
			{TextTemplates.map((textItem, index) => (
				<Text key={`sidebar-text-item-${index}`} text={textItem} />
			))}
		</div>
	);
}
