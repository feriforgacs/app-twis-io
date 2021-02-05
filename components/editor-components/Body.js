import { useContext, useEffect, useCallback, useState } from "react";
import Moveable from "react-moveable";
import { GlobalContext } from "../../context/GlobalState";
import styles from "./Body.module.scss";
import ScreenList from "./screen-components/ScreenList";
import ScreenSettings from "./screen-components/ScreenSettings";
import ItemSettings from "./screen-components/ItemSettings";

export default function Body() {
	const { activeScreen, resetActiveScreen, activeScreenItem, setActiveScreenItem, resetActiveScreenItem, updateScreenItem, moveableDisabled } = useContext(GlobalContext);
	const [moveableTarget, setMoveableTarget] = useState();

	/**
	 * Remove moveable from current item on click outside
	 * @param {obj} event Event object
	 */
	const handleClickOutside = useCallback(
		(event) => {
			if (event.target.classList && !event.target.classList.contains(`moveable-control`) && !event.target.classList.contains(`screen-item`) && !event.target.classList.contains(`screen-item-children`) && !event.target.classList.contains(`screen-item__action`) && !event.target.classList.contains(`item-settings`)) {
				resetActiveScreenItem();
			}
		},
		[resetActiveScreenItem]
	);

	/**
	 * Set active screen item on blobal state when clicking on an item
	 */
	useEffect(() => {
		document.addEventListener("mousedown", handleClickOutside, true);
		setMoveableTarget(document.getElementById(`${activeScreenItem.type}-${activeScreenItem.itemId}`));
		return () => {
			document.removeEventListener("mousedown", handleClickOutside, true);
		};
	}, [handleClickOutside, activeScreenItem]);

	/**
	 * Set start values for rotate, resize, move
	 */
	let activeScreenItemTranslateX = 0;
	let activeScreenItemTranslateY = 0;
	let activeScreenItemRotate = 0;
	let activeScreenItemWidth = 0;
	let activeScreenItemHeight = 0;

	if (activeScreenItem !== "") {
		if (typeof activeScreenItem.settings.translateX !== undefined) {
			activeScreenItemTranslateX = activeScreenItem.settings.translateX;
		}

		if (typeof activeScreenItem.settings.translateY !== undefined) {
			activeScreenItemTranslateY = activeScreenItem.settings.translateY;
		}

		if (typeof activeScreenItem.settings.rotate !== undefined) {
			activeScreenItemRotate = activeScreenItem.settings.rotate;
		}

		if (typeof activeScreenItem.settings.width !== undefined) {
			activeScreenItemWidth = activeScreenItem.settings.width;
		}

		if (typeof activeScreenItem.settings.height !== undefined) {
			activeScreenItemHeight = activeScreenItem.settings.height;
		}
	}

	return (
		<div
			id="editor__body"
			className={styles.body}
			onMouseDown={(e) => {
				if (e.target && e.target.id === "editor__body") {
					resetActiveScreen();
				}
			}}
		>
			{activeScreenItem !== "" && !moveableDisabled && (
				<Moveable
					snappable={true}
					snapThreshold={5}
					snapGap={true}
					snapElement={true}
					snapVertical={true}
					snapHorizontal={true}
					snapCenter={true}
					snapDigit={0}
					origin={false}
					edge={false}
					renderDirections={["nw", "n", "ne", "w", "e", "sw", "s", "se"]}
					className={`moveable-${activeScreenItem.type}-${activeScreenItem.itemId}`}
					target={moveableTarget}
					draggable={true}
					throttleDrag={0}
					onDragStart={({ set }) => {
						const startTranslateX = activeScreenItem.settings.translateX || 0;
						const startTranslateY = activeScreenItem.settings.translateY || 0;
						set([startTranslateX, startTranslateY]);
					}}
					onDrag={({ target, beforeTranslate }) => {
						target.style.transform = `translateX(${beforeTranslate[0]}px) translateY(${beforeTranslate[1]}px) rotate(${activeScreenItem.settings.rotate || 0}deg)`;
						activeScreenItemTranslateX = beforeTranslate[0];
						activeScreenItemTranslateY = beforeTranslate[1];
					}}
					onDragEnd={() => {
						// check previous values, return if no changes were made
						if (activeScreenItem.settings.translateX === activeScreenItemTranslateX && activeScreenItem.settings.translateY === activeScreenItemTranslateY) {
							return;
						}
						// update screen item translate settings in local state and also save it to the database
						updateScreenItem(activeScreen.orderIndex, activeScreenItem.orderIndex, activeScreenItem.itemId, {
							settings: {
								...activeScreenItem.settings,
								translateX: activeScreenItemTranslateX,
								translateY: activeScreenItemTranslateY,
							},
						});

						// update active screen item settings to properly set new values for upcoming translations
						setActiveScreenItem({
							...activeScreenItem,
							settings: {
								...activeScreenItem.settings,
								translateX: activeScreenItemTranslateX,
								translateY: activeScreenItemTranslateY,
							},
						});
					}}
					resizable={true}
					throttleResize={0}
					keepRatio={activeScreenItem.type === "sticker" || activeScreenItem.type === "image"}
					onResizeStart={({ target, set, setOrigin, dragStart }) => {
						setOrigin(["%", "%"]);
						const style = window.getComputedStyle(target);
						const cssWidth = parseFloat(style.width);
						const cssHeight = parseFloat(style.height);
						set([cssWidth, cssHeight]);
						dragStart && dragStart.set([activeScreenItem.settings.translateX, activeScreenItem.settings.translateY]);
						activeScreenItemWidth = cssWidth;
						activeScreenItemHeight = cssHeight;
					}}
					onResize={({ target, width, height, drag }) => {
						target.style.width = `${width}px`;
						target.style.height = `${height}px`;
						target.style.transform = `translateX(${drag.beforeTranslate[0]}px) translateY(${drag.beforeTranslate[1]}px) rotate(${activeScreenItem.settings.rotate || 0}deg)`;
						activeScreenItemTranslateX = drag.beforeTranslate[0];
						activeScreenItemTranslateY = drag.beforeTranslate[1];
						activeScreenItemWidth = width;
						activeScreenItemHeight = height;
					}}
					onResizeEnd={() => {
						// check previous values, return if no changes were made
						if (activeScreenItem.settings.translateX === activeScreenItemTranslateX && activeScreenItem.settings.translateY === activeScreenItemTranslateY && activeScreenItem.settings.width === activeScreenItemWidth && activeScreenItem.settings.height === activeScreenItemHeight) {
							return;
						}
						// update screen item translate settings in local state and also save it to the database
						updateScreenItem(activeScreen.orderIndex, activeScreenItem.orderIndex, activeScreenItem.itemId, {
							settings: {
								...activeScreenItem.settings,
								translateX: activeScreenItemTranslateX,
								translateY: activeScreenItemTranslateY,
								width: activeScreenItemWidth,
								height: activeScreenItemHeight,
							},
						});

						// update active screen item settings to properly set new falues for upcoming translations
						setActiveScreenItem({
							...activeScreenItem,
							settings: {
								...activeScreenItem.settings,
								translateX: activeScreenItemTranslateX,
								translateY: activeScreenItemTranslateY,
								width: activeScreenItemWidth,
								height: activeScreenItemHeight,
							},
						});
					}}
					rotatable={true}
					throttleRotate={0}
					rotationPosition="top"
					onRotateStart={({ set }) => {
						set(activeScreenItem.settings.rotate || 0);
					}}
					onRotate={({ target, beforeRotate }) => {
						target.style.transform = `translateX(${activeScreenItem.settings.translateX}px) translateY(${activeScreenItem.settings.translateY}px) rotate(${beforeRotate}deg)`;
						activeScreenItemRotate = beforeRotate;
					}}
					onRotateEnd={() => {
						// check previous values, return if no changes were made
						if (activeScreenItem.settings.rotate === activeScreenItemRotate) {
							return;
						}
						// update screen item translate settings in local state and also save it to the database
						updateScreenItem(activeScreen.orderIndex, activeScreenItem.orderIndex, activeScreenItem.itemId, {
							settings: {
								...activeScreenItem.settings,
								rotate: activeScreenItemRotate,
							},
						});

						// update active screen item settings to properly set new falues for upcoming translations
						setActiveScreenItem({
							...activeScreenItem,
							settings: {
								...activeScreenItem.settings,
								rotate: activeScreenItemRotate,
							},
						});
					}}
				/>
			)}

			<ScreenList />
			<ScreenSettings visible={activeScreen ? true : false} />
			{activeScreenItem && <ItemSettings />}
		</div>
	);
}
