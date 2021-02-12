import styles from "./ItemAdditionalActions.module.scss";
import Position from "./item-actions/Position";
import Delete from "./item-actions/Delete";

export default function ItemAdditionalActions() {
	return (
		<div className={styles.additionalActions}>
			<Position />
			<Delete />
		</div>
	);
}
