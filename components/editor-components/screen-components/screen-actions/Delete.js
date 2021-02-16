import { useContext } from "react";
import ReactTooltip from "react-tooltip";
import styles from "../Screen.module.scss";
import Image from "next/image";
import { GlobalContext } from "../../../../context/GlobalState";

export default function Delete({ screen }) {
	const { removeScreen } = useContext(GlobalContext);
	return (
		<>
			<button
				data-for="screenAction"
				data-tip="Delete screen"
				className={`${styles.buttonScreen} ${styles.buttonScreenDelete}`}
				onClick={() => {
					removeScreen(screen.screenId);
					ReactTooltip.hide();
				}}
			>
				<Image src="/images/editor/icons/icon-delete.svg" width={18} height={18} alt="Delete screen icon" title="Delete screen" />
			</button>
			<ReactTooltip id="screenAction" place="bottom" type="dark" effect="solid" getContent={(dataTip) => `${dataTip}`} />
		</>
	);
}
