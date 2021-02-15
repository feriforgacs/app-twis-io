import styles from "../ElementOptions.module.scss";
import ButtonTypes from "../../../../utils/ButtonTypes";
import Button from "./Button";
export default function ButtonList({ active = false }) {
	return (
		<div className={`${styles.elementOptions} ${!active ? "hidden" : ""}`}>
			{ButtonTypes.map((buttonItem, index) => (
				<Button key={`sidebar-button-item-${index}`} button={buttonItem} />
			))}
		</div>
	);
}
