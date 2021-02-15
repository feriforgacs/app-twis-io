import styles from "../ElementOptions.module.scss";
import TextTypes from "../../../../utils/TextTypes";
import Text from "./Text";
export default function TextList({ active = false }) {
	return (
		<div className={`${styles.elementOptions} ${!active ? "hidden" : ""}`}>
			{TextTypes.map((textItem, index) => (
				<Text key={`sidebar-text-item-${index}`} text={textItem} />
			))}
		</div>
	);
}
