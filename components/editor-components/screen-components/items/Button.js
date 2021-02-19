import { useContext, useState, useRef } from "react";
import { GlobalContext } from "../../../../context/GlobalState";
import ContentEditable from "react-contenteditable";

export default function Button({ data }) {
	const { activeScreen, activeScreenItem, setActiveScreenItem, updateScreenItem, setMoveableDisabled } = useContext(GlobalContext);
	const screenItemActive = activeScreenItem.itemId === data.itemId;
	const [editableDisabled, setEditableDisabled] = useState(true);

	const text = useRef(data.content);
	const editableContent = useRef();

	const handleChange = (event) => {
		text.current = event.target.value;
	};

	/**
	 * Update state on blur and disable contenteditable
	 */
	const handleBlur = () => {
		// disable content editable
		setEditableDisabled(true);

		/**
		 * Update text block height based on the height of the text
		 * const newHeight = document.querySelector(`#text-${activeScreenItem.itemId} span`).offsetHeight;
		 */

		if (text.current !== data.content) {
			// update screen item in state and db
			updateScreenItem(activeScreen.screenId, activeScreenItem.itemId, { content: text.current });
		}

		// set active screen item to current item
		setActiveScreenItem({ ...data, content: text.current });

		// enable moveable
		setMoveableDisabled(false);
	};

	/**
	 * Clear pasted text
	 * @param {object} event Paste event object
	 */
	const pastePlaintext = (event) => {
		event.preventDefault();
		const text = event.clipboardData.getData("text/plain");
		document.execCommand("insertHTML", false, text);
	};

	/**
	 * Disable contenteditable on enter
	 * @param {object} event Keypress event object
	 */
	const disableNewlines = (event) => {
		const keyCode = event.keyCode || event.which;

		if (keyCode === 13) {
			event.returnValue = false;
			if (event.preventDefault) {
				event.preventDefault();
			}

			handleBlur();
		}
	};

	let buttonStyle = {
		background: data.settings.highlightColor.backgroundColor,
		textAlign: data.settings.align,
		width: `${data.settings.width}px`,
		height: `${data.settings.height}px`,
		transform: `translateX(${data.settings.translateX}px) translateY(${data.settings.translateY}px) rotate(${data.settings.rotate}deg)`,
		top: `${data.settings.top}px`,
		left: `${data.settings.left}px`,
		opacity: typeof data.settings.opacity !== undefined ? data.settings.opacity : 1,
		zIndex: data.orderIndex,
		position: "absolute",
	};

	let buttonTextStyle = {
		color: `rgba(${data.settings.color.r}, ${data.settings.color.g}, ${data.settings.color.b}, ${data.settings.color.a})`,
		fontSize: `${data.settings.fontSize}px`,
		fontWeight: data.settings.bold ? 700 : 400,
		fontStyle: data.settings.italic ? `italic` : `normal`,
		textDecoration: data.settings.underline ? `underline` : `none`,
		textTransform: data.settings.uppercase ? `uppercase` : `none`,
	};

	const fontFamilyClass = data.settings.fontFamily !== "" ? `font--${data.settings.fontFamily}` : `font--arial`;

	if (screenItemActive && editableDisabled) {
		buttonStyle.cursor = "move";
		buttonTextStyle.cursor = "move";
	}

	if (!screenItemActive) {
		buttonTextStyle.cursor = "text";
	}

	return (
		<div
			onClick={() => {
				if (editableDisabled) {
					setActiveScreenItem(data);
				}
			}}
			style={buttonStyle}
			id={`${data.type}-${data.itemId}`}
			className={`screen-item screen-item--button ${fontFamilyClass} ${data.settings.classNames ? data.settings.classNames : ""}`}
			title="Single click to select, double click to edit text"
		>
			<ContentEditable
				style={buttonTextStyle}
				innerRef={editableContent}
				html={text.current}
				onBlur={handleBlur}
				onChange={handleChange}
				className={`screen-item ${screenItemActive ? "active" : ""}`}
				tagName="span"
				disabled={editableDisabled}
				onDoubleClick={() => {
					// turn on content editable
					setEditableDisabled(false);

					// set active screen item to current item
					setActiveScreenItem(data);

					// disable moveable
					setMoveableDisabled(true);

					setTimeout(() => {
						editableContent.current.focus();
					}, 200);
				}}
				onPaste={pastePlaintext}
				onKeyPress={disableNewlines}
			/>
		</div>
	);
}
