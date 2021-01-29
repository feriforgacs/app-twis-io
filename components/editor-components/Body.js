import { useContext, useEffect, useCallback, useState } from "react";
import Moveable from "react-moveable";
import { GlobalContext } from "../../context/GlobalState";
import styles from "./Body.module.scss";
import ScreenList from "./screen-components/ScreenList";

export default function Body() {
	const { resetActiveScreen, activeScreenItem, resetActiveScreenItem } = useContext(GlobalContext);
	const [moveableTarget, setMoveableTarget] = useState();

	/**
	 * Remove moveable from current item on click outside
	 * @param {obj} event Event object
	 */
	const handleClickOutside = useCallback(
		(event) => {
			if (event.target.classList && !event.target.classList.contains(`moveable-control`) && !event.target.classList.contains(`screen-item`)) {
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
			{activeScreenItem !== "" && activeScreenItem.moveable !== false && (
				<>
					<p style={{ position: "fixed", top: "300px", left: "400px", zIndex: "9999999", border: "1px solid red" }}>MOVEABLE</p>
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
						className={`moveable-${activeScreenItem.id}`}
						target={moveableTarget}
						/** draggable */
						draggable={true}
						throttleDrag={0}
						onDragStart={({ set }) => {
							set([activeScreenItem.position.translateX, activeScreenItem.position.translateY]);
						}}
						onDrag={({ target, beforeTranslate }) => {
							target.style.transform = `translateX(${beforeTranslate[0]}px) translateY(${beforeTranslate[1]}px) rotate(${activeScreenItem.position.rotate}deg)`;
							activeScreenItemTranslateX = beforeTranslate[0];
							activeScreenItemTranslateY = beforeTranslate[1];
						}}
						onDragEnd={() => {
							/*updateScreenItem(activeScreenItem.screen, activeScreenItem.screenIndex, activeScreenItem.index, {
							...activeScreenItem,
							position: {
								...activeScreenItem.position,
								translateX: activeScreenItemTranslateX,
								translateY: activeScreenItemTranslateY,
							},
						});
						setActiveScreenItem({
							...activeScreenItem,
							position: {
								...activeScreenItem.position,
								translateX: activeScreenItemTranslateX,
								translateY: activeScreenItemTranslateY,
							},
						});*/
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
							dragStart && dragStart.set([activeScreenItem.position.translateX, activeScreenItem.position.translateY]);
							activeScreenItemWidth = cssWidth;
							activeScreenItemHeight = cssHeight;
						}}
						onResize={({ target, width, height, drag }) => {
							target.style.width = `${width}px`;
							target.style.height = `${height}px`;
							target.style.transform = `translateX(${drag.beforeTranslate[0]}px) translateY(${drag.beforeTranslate[1]}px) rotate(${activeScreenItem.position.rotate}deg)`;
							activeScreenItemTranslateX = drag.beforeTranslate[0];
							activeScreenItemTranslateY = drag.beforeTranslate[1];
							activeScreenItemWidth = width;
							activeScreenItemHeight = height;
						}}
						onResizeEnd={() => {
							/*updateScreenItem(activeScreenItem.screen, activeScreenItem.screenIndex, activeScreenItem.index, {
							...activeScreenItem,
							position: {
								...activeScreenItem.position,
								translateX: activeScreenItemTranslateX,
								translateY: activeScreenItemTranslateY,
							},
							size: {
								width: activeScreenItemWidth,
								height: activeScreenItemHeight,
							},
						});
						setActiveScreenItem({
							...activeScreenItem,
							position: {
								...activeScreenItem.position,
								translateX: activeScreenItemTranslateX,
								translateY: activeScreenItemTranslateY,
							},
							size: {
								width: activeScreenItemWidth,
								height: activeScreenItemHeight,
							},
						});*/
						}}
						rotatable={true}
						throttleRotate={0}
						rotationPosition="top"
						onRotateStart={({ set }) => {
							set(activeScreenItem.position.rotate);
						}}
						onRotate={({ target, beforeRotate }) => {
							target.style.transform = `translateX(${activeScreenItem.position.translateX}px) translateY(${activeScreenItem.position.translateY}px) rotate(${beforeRotate}deg)`;
							activeScreenItemRotate = beforeRotate;
						}}
						onRotateEnd={() => {
							/*updateScreenItem(activeScreenItem.screen, activeScreenItem.screenIndex, activeScreenItem.index, {
							...activeScreenItem,
							position: {
								...activeScreenItem.position,
								rotate: activeScreenItemRotate,
							},
						});
						setActiveScreenItem({
							...activeScreenItem,
							position: {
								...activeScreenItem.position,
								rotate: activeScreenItemRotate,
							},
						});*/
						}}
					/>
				</>
			)}

			<ScreenList />
		</div>
	);
}
