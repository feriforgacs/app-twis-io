import Button from "../Button";
import styles from "./Image.module.scss";

export default function MediaLibraryImages() {
	return (
		<div className={styles.imageList}>
			<Button label="Upload New Image" />
		</div>
	);
}
