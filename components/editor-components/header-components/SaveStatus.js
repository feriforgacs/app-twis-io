import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../../context/GlobalState";
import styles from "./SaveStatus.module.scss";

export default function SaveStatus() {
	const { saving } = useContext(GlobalContext);
	const [status, setStatus] = useState("");
	useEffect(() => {
		if (saving) {
			setStatus("Saving changes...");
		} else {
			setStatus("All changes saved");
		}
	}, [saving]);
	return <span className={styles.status}>{status}</span>;
}
