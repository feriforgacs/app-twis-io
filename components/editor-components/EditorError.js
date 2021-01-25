import Image from "next/image";
import styles from "./Editor.module.scss";

export default function EditorError({ errorMessage = "😢 An error occured. Please, refresh the page and try again." }) {
	return (
		<div className={styles.editorError}>
			<p>{errorMessage}</p>
			<Image src="/images/editor/illustrations/illustration-error.png" width={400} height={266} />
			<p className={styles.editorErrorInfo}>
				If you keep seeing this error,{" "}
				<a href="/contact" target="_blank" rel="noreferrer">
					please get in touch
				</a>
				.
			</p>
		</div>
	);
}
