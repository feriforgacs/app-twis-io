import styles from "../ElementOptions.module.scss";
import Text from "./Text";
export default function TextList() {
	return (
		<div className={styles.elementOptions}>
			<Text additionalClasses="bold" text="Heading text block" />
			<Text additionalClasses="bold" text="Subheading text block" />
			<Text additionalClasses="" text="Body text block" />
		</div>
	);
}
