import { useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import ReactTooltip from "react-tooltip";
import styles from "../Screen.module.scss";
import Image from "next/image";
import { GlobalContext } from "../../../../context/GlobalState";

export default function Duplicate({ screen }) {
	const { duplicateScreen } = useContext(GlobalContext);

	/**
	 * Copy current screen data to duplicate it
	 */
	const copyScreen = () => {
		// clone current screen
		const newScreen = { ...screen };

		// remove screens db id
		delete newScreen._id;
		delete newScreen.id;

		// generated uuid for new screen
		const newScreenId = uuidv4();
		newScreen.screenId = newScreenId;

		// update screen order index
		newScreen.orderIndex = newScreen.orderIndex + 1;

		// generated new uuid for screen items and also update screenId
		const newScreenItems = newScreen.screenItems.map((screenItem) => {
			const newScreenItem = { ...screenItem };
			// update item's screen id
			newScreenItem.screenId = newScreenId;
			// generate new uuid for screen item
			newScreenItem.itemId = uuidv4();
			// remove duplicated item's db id
			delete newScreenItem._id;
			// return cloned item
			return newScreenItem;
		});

		// update screen items in screen object
		newScreen.screenItems = newScreenItems;

		// add new screen to state and save it to the db
		duplicateScreen(screen.screenId, newScreen);
	};

	return (
		<>
			<button
				data-for="screenAction"
				data-tip="Duplicate screen"
				className={`${styles.buttonScreen} ${styles.buttonScreenDuplicate}`}
				onClick={() => {
					copyScreen();
					ReactTooltip.hide();
				}}
			>
				<Image src="/images/editor/icons/icon-duplicate.svg" width={18} height={18} alt="Duplicate screen icon" title="Duplicate screen" />
			</button>
			<ReactTooltip id="screenAction" place="bottom" type="dark" effect="solid" getContent={(dataTip) => `${dataTip}`} />
		</>
	);
}
