import styles from "./Image.module.scss";

export default function ImageUploadPreview({ thumb, caption }) {
	return (
		<figure className={styles.imageUploadPreview}>
			<img src={thumb} alt={caption} title="Uploading..." />
		</figure>
	);
}
