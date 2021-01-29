import { useContext, useRef } from "react";
import { useDrop } from "react-dnd";
import { v4 as uuidv4 } from "uuid";
import { GlobalContext } from "../../../context/GlobalState";
import { ItemTypes } from "../../../utils/Items";
import styles from "./Screen.module.scss";
import Image from "next/image";
import ReactTooltip from "react-tooltip";
import ScreenAddActions from "./ScreenAddActions";
import ScreenItem from "./items/ScreenItem";
import axios from "axios";

export default function Screen({ screen, screenIndex }) {
	const { addScreenItem, activeScreen, setActiveScreen, setActiveScreenItem } = useContext(GlobalContext);

	const screenTypeNames = {
		start: "Start Screen",
		endSuccess: "End Screen Success",
		endFailure: "End Screen Failure",
		question: "Question Screen",
		info: "Info Screen",
	};

	const screenRef = useRef();

	const [{ isOver }, drop] = useDrop({
		accept: [ItemTypes.TEXT, ItemTypes.IMAGE, ItemTypes.STICKER],
		collect: (monitor) => ({
			isOver: !!monitor.isOver(),
		}),
		drop: (item, monitor) => {
			const offset = monitor.getSourceClientOffset();
			const dropTargetXy = screenRef.current.getBoundingClientRect();
			const droppedItemX = Math.floor(offset.x - dropTargetXy.left) < 0 ? 0 : Math.floor(offset.x - dropTargetXy.left);
			const droppedItemY = Math.floor(offset.y - dropTargetXy.top) < 0 ? 0 : Math.floor(offset.y - dropTargetXy.top);

			console.log(item);

			/**
			 * Add item to screen items
			 */
			const newScreenItem = {
				itemId: uuidv4(),
				screenId: screen.screenId,
				type: item.type,
				content: item.content || "",
				src: item.src || "",
				orderIndex: screen.screenItems ? screen.screenItems.length : 0,
				settings: {
					top: droppedItemY,
					left: droppedItemX,
					width: Math.round(item.size.width),
					height: Math.round(item.size.height),
					translateX: 0,
					translateY: 0,
					rotate: 0,
				},
			};

			// add new item to state and save to db
			// the screen._id parameter is necessary to create the screen and item connection in the db
			addScreenItem(screenIndex, newScreenItem, screen._id);

			/**
			 * Set screen to active screen
			 */
			setActiveScreen(screen);

			/**
			 * Set item as active item
			 */
			setActiveScreenItem(newScreenItem);

			/**
			 * Trigger unsplash download if necessary
			 */
			if (item.unsplashImage && item.unsplashId) {
				axios(`${process.env.APP_URL}/api/editor/stock-photo/download?id=${item.unsplashId}`);
			}
		},
	});

	return (
		<>
			{screen.type === "endSuccess" && <ScreenAddActions />}
			<div
				className={styles.screen}
				onClick={() => {
					setActiveScreen(screen);
				}}
				id={`screen-${screen.type}-${screen.screenId}`}
			>
				<div className={styles.screenActions}>
					<button className={`${styles.buttonScreen} ${styles.buttonScreenSettings}`}>
						<Image src="/images/editor/icons/icon-cog.svg" width={18} height={18} alt="Screen settings icon" />
						<span className={styles.buttonLabel}>{screenTypeNames[screen.type]}</span>
					</button>
					{screen.type === "question" || screen.type === "info" ? (
						<>
							<div className={styles.screenAdditionalActions}>
								<button data-for="screenAction" data-tip="Move up" className={`${styles.buttonScreen} ${styles.buttonScreenMoveUp}`}>
									<Image src="/images/editor/icons/icon-move-up.svg" width={18} height={18} alt="Move screen up icon" title="Move up" />
								</button>

								<button data-for="screenAction" data-tip="Move down" className={`${styles.buttonScreen} ${styles.buttonScreenMoveDown}`}>
									<Image src="/images/editor/icons/icon-move-down.svg" width={18} height={18} alt="Move screen down icon" title="Move down" />
								</button>

								<button data-for="screenAction" data-tip="Duplicate screen" className={`${styles.buttonScreen} ${styles.buttonScreenDuplicate}`}>
									<Image src="/images/editor/icons/icon-duplicate.svg" width={18} height={18} alt="Duplicate screen icon" title="Duplicate screen" />
								</button>

								<button data-for="screenAction" data-tip="Delete screen" className={`${styles.buttonScreen} ${styles.buttonScreenDelete}`}>
									<Image src="/images/editor/icons/icon-delete.svg" width={18} height={18} alt="Delete screen icon" title="Delete screen" />
								</button>
							</div>
							<ReactTooltip id="screenAction" place="bottom" type="dark" effect="solid" getContent={(dataTip) => `${dataTip}`} />
						</>
					) : (
						""
					)}
				</div>
				<div
					ref={drop}
					style={{
						position: `relative`,
					}}
				>
					<div ref={screenRef} className={`${styles.screenBody} ${isOver ? styles.screenBodyDropover : ""} ${activeScreen !== "" && activeScreen.screenId === screen.screenId ? styles.screenBodyActive : ""}`}>
						{screen.screenItems && screen.screenItems.length > 0 && screen.screenItems.map((screenItem, index) => <ScreenItem key={index} screenItem={screenItem} />)}
					</div>
				</div>
			</div>
		</>
	);
}
