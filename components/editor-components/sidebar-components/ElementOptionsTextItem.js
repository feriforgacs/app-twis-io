import styles from "./ElementOptions.module.scss";

export default function ElementOptionsTextItem({ additionalClasses = "", text = "Text block" }) {
	return <div className={`${styles.optionText} ${styles.option} ${additionalClasses}`}>{text}</div>;
}
