import styles from "./ElementOptions.module.scss";
import ElementOptionsTextItem from "./ElementOptionsTextItem";
export default function ElementOptionsText() {
	return (
		<div className={styles.elementOptions}>
			<ElementOptionsTextItem additionalClasses="bold" text="Heading text block" />
			<ElementOptionsTextItem additionalClasses="bold" text="Subheading text block" />
			<ElementOptionsTextItem additionalClasses="" text="Body text block" />
		</div>
	);
}
