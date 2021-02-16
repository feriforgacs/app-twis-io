import styles from "./Screen.module.scss";
import Order from "./screen-actions/Order";
import Duplicate from "./screen-actions/Duplicate";
import Delete from "./screen-actions/Delete";

export default function ScreenAdditionalActions({ screen }) {
	return (
		<>
			<div className={styles.screenAdditionalActions} id={`screen-additional-actions--${screen.screenId}`}>
				<Order screen={screen} />
				<Duplicate screen={screen} />
				<Delete screen={screen} />
			</div>
		</>
	);
}
