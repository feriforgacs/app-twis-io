import styles from "./ItemAdditionalActions.module.scss";
import Delete from "./item-actions/Delete";

export default function ItemAdditionalActions() {
	return (
		<div className={styles.additionalActions}>
			<Delete />
		</div>
	);
}
