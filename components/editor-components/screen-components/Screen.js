import { useContext, useRef } from "react";
import { useDrop } from "react-dnd";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { GlobalContext } from "../../../context/GlobalState";
import { ItemTypes } from "../../../utils/Items";
import styles from "./Screen.module.scss";
import Image from "next/image";
import ScreenAddActions from "./ScreenAddActions";
import ScreenItem from "./items/ScreenItem";
import ScreenAdditionalActions from "./ScreenAdditionalActions";

export default function Screen({ screen, screenIndex }) {
	const { addScreenItem, activeScreen, setActiveScreen, activeScreenItem, setActiveScreenItem, resetActiveScreenItem } = useContext(GlobalContext);

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
					...item.settings,
					top: droppedItemY,
					left: droppedItemX,
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

	const screenActive = activeScreen !== "" && activeScreen.screenId === screen.screenId && !activeScreenItem;

	return (
		<>
			{screen.type === "endSuccess" && <ScreenAddActions />}
			<div
				className={styles.screen}
				onClick={(e) => {
					setActiveScreen(screen);

					// unset active screen item
					if (!e.target.classList.contains("screen-item")) {
						resetActiveScreenItem();
					}
				}}
				id={`screen-${screen.type}-${screen.screenId}`}
			>
				<div className={styles.screenActions}>
					<button className={`${styles.buttonScreen} ${styles.buttonScreenSettings}`}>
						<Image src="/images/editor/icons/icon-cog.svg" width={18} height={18} alt="Screen settings icon" />
						<span className={styles.buttonLabel}>{screenTypeNames[screen.type]}</span>
					</button>
					{screen.type === "question" || screen.type === "info" ? <ScreenAdditionalActions screen={screen} /> : ""}
				</div>
				<div ref={drop} className={styles.screenBodyContainer}>
					<div ref={screenRef} className={`${styles.screenBody} ${isOver ? styles.screenBodyDropover : ""} ${screenActive ? styles.screenBodyActive : ""}`} style={{ background: screen.background }}>
						{screen.screenItems && screen.screenItems.length > 0 && screen.screenItems.map((screenItem, index) => <ScreenItem key={index} screenItem={screenItem} />)}
					</div>
				</div>
			</div>
		</>
	);
}
