import { useContext, useState, useRef } from "react";
import { GlobalContext } from "../../../../context/GlobalState";
import ContentEditable from "react-contenteditable";

export default function Text({ data }) {
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

		if (text.current !== data.content) {
			// update screen item in state and db
			updateScreenItem(activeScreen.orderIndex, activeScreenItem.orderIndex, activeScreenItem.itemId, { content: text.current });
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

			// disable editable
			setEditableDisabled(true);

			if (text.current !== data.content) {
				// update screen item in state and db
				updateScreenItem(activeScreen.orderIndex, activeScreenItem.orderIndex, activeScreenItem.itemId, { content: text.current });
			}

			// set current item as active
			setActiveScreenItem({ ...data, content: text.current });

			// enable moveable
			setMoveableDisabled(false);
		}
	};

	let textContainerStyle = {
		textAlign: data.settings.align,
		width: `${data.settings.width}px`,
		height: `${data.settings.height}px`,
		transform: `translateX(${data.settings.translateX}px) translateY(${data.settings.translateY}px) rotate(${data.settings.rotate}deg)`,
		top: `${data.settings.top}px`,
		left: `${data.settings.left}px`,
		opacity: data.settings.opacity || 1,
		position: "absolute",
	};

	if (screenItemActive && editableDisabled) {
		textContainerStyle.cursor = "move";
	}

	let textStyle = {
		background: data.settings.highlightColor,
		color: data.settings.color,
		fontFamily: data.settings.fontFamily,
		fontSize: `${data.settings.fontSize}px`,
		fontWeight: data.settings.bold ? 700 : 400,
		fontStyle: data.settings.italic ? `italic` : `normal`,
		textDecoration: data.settings.underline ? `underline` : `none`,
	};

	return (
		<div onClick={() => editableDisabled && setActiveScreenItem(data)} style={textContainerStyle} id={`${data.type}-${data.itemId}`} className="screen-item">
			<span className="screen-item-children" style={textStyle}>
				<ContentEditable
					style={textStyle}
					innerRef={editableContent}
					html={text.current}
					onBlur={handleBlur}
					onChange={handleChange}
					className="screen-item-children"
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
			</span>
		</div>
	);
}
