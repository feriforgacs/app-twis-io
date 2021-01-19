import Image from "next/image";
import styles from "./Button.module.scss";

export default function Button({ label = "Button label", loading = false, disabled = false, onClick }) {
	return (
		<button className={styles.button} disabled={disabled || loading} onClick={onClick}>
			{loading && (
				<span className={styles.loading}>
					<Image src="/images/editor/icons/icon-loading.svg" width={20} height={20} />
				</span>
			)}
			<span className={styles.buttonLabel}>{label}</span>
		</button>
	);
}
