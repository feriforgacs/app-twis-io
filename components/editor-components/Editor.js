import { useEffect, useContext } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { GlobalContext } from "../../context/GlobalState";
import styles from "./Editor.module.scss";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Body from "./Body";
import EditorError from "./EditorError";

export default function Editor({ campaignId }) {
	const { loadCampaignData, error, errorMessage } = useContext(GlobalContext);

	useEffect(() => {
		loadCampaignData(campaignId);
	}, []);
	return (
		<>
			{error ? (
				<EditorError errorMessage={errorMessage} />
			) : (
				<div id="editor" className={styles.editor}>
					<Header />
					<DndProvider backend={HTML5Backend}>
						<Sidebar />
						<Body />
					</DndProvider>
				</div>
			)}
		</>
	);
}
