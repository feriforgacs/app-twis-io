import { useState } from "react";
import styles from "../ElementOptions.module.scss";

export default function ImageList() {
	const [activeTab, setActiveTab] = useState("medialibrary");
	return (
		<div className={styles.elementOptions}>
			<div className={styles.tabs}>
				<div onClick={() => setActiveTab("medialibrary")} className={`${styles.tab} ${activeTab === "medialibrary" ? styles.tabActive : ""}`}>
					Media library
				</div>
				<div onClick={() => setActiveTab("stock")} className={`${styles.tab} ${activeTab === "stock" ? styles.tabActive : ""}`}>
					Stock photos
				</div>
				<div onClick={() => setActiveTab("gif")} className={`${styles.tab} ${activeTab === "gif" ? styles.tabActive : ""}`}>
					GIFs
				</div>
			</div>
		</div>
	);
}
