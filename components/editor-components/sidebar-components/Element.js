import styles from "./Element.module.scss";
import Image from "next/image";

export default function Element({ active = false, icon, label }) {
	return (
		<div className={`${styles.element} ${active ? styles.elementActive : ""}`}>
			<span className={styles.icon}>
				<Image src={`/images/editor/icons/icon-${icon}.svg`} alt={`${label} icon`} width={20} height={20} />
			</span>
			<span className={styles.label}>{label}</span>
		</div>
	);
}
