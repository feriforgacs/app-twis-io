import { useEffect, useContext } from "react";
import { GlobalContext } from "../../context/GlobalState";
import styles from "./Editor.module.scss";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Body from "./Body";
import EditorError from "./EditorError";
import Toast from "../dashboard-components/Toast";

export default function Editor({ campaignId }) {
	const { loadCampaignData, criticalError, criticalErrorMessage, error, errorMessage, setError } = useContext(GlobalContext);

	useEffect(() => {
		loadCampaignData(campaignId);
	}, []); // eslint-disable-line
	return (
		<>
			{criticalError ? (
				<EditorError errorMessage={criticalErrorMessage} />
			) : (
				<>
					<div id="editor" className={styles.editor}>
						<Header />
						<Sidebar />
						<Body />
						{error && <Toast onClose={() => setError(false, "")} duration={4000} type={"error"} content={errorMessage} />}
					</div>
				</>
			)}
		</>
	);
}
