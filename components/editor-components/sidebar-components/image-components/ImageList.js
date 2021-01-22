import { useState } from "react";
import styles from "../ElementOptions.module.scss";
import MediaLibrary from "./MediaLibrary";
import StockImages from "./StockImages";
import Gifs from "./Gifs";

export default function ImageList({ active = false }) {
	const [activeTab, setActiveTab] = useState("medialibrary");
	return (
		<div className={`${!active ? "hidden" : ""}`}>
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
			<MediaLibrary active={activeTab === "medialibrary"} />
			<StockImages active={activeTab === "stock"} />
			<Gifs active={activeTab === "gif"} />
		</div>
	);
}
