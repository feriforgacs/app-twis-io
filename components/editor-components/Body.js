import { useContext, useEffect, useCallback, useState } from "react";
import Moveable from "react-moveable";
import { GlobalContext } from "../../context/GlobalState";
import styles from "./Body.module.scss";
import ScreenList from "./screen-components/ScreenList";

export default function Body() {
	const { activeScreen, resetActiveScreen, activeScreenItem, setActiveScreenItem, resetActiveScreenItem, updateScreenItem } = useContext(GlobalContext);
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
			{activeScreenItem !== "" && (
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
						updateScreenItem(activeScreen.orderIndex, activeScreenItem.orderIndex, activeScreenItem.itemId, {
							settings: {
								...activeScreenItem.settings,
								translateX: activeScreenItemTranslateX,
								translateY: activeScreenItemTranslateY,
							},
						});

						setActiveScreenItem({
							...activeScreenItem,
							settings: {
								...activeScreenItem.settings,
								translateX: activeScreenItemTranslateX,
								translateY: activeScreenItemTranslateY,
							},
						});
					}}
				/>
			)}

			<ScreenList />
		</div>
	);
}
