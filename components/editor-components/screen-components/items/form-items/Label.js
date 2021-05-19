import { useContext, useState, useRef } from "react";
import { GlobalContext } from "../../../../../context/GlobalState";
import ContentEditable from "react-contenteditable";
import CleanString from "../../../../../helpers/CleanString";

export default function Label({ labelKey, value }) {
	const { activeScreen, activeScreenItem, setActiveScreenItem, updateScreenItem, setMoveableDisabled } = useContext(GlobalContext);
	const [editableDisabled, setEditableDisabled] = useState(true);

	const text = useRef(value);
	const editableContent = useRef();

	const handleChange = (event) => {
		text.current = CleanString(event.target.value);
	};

	/**
	 * Update state on blur and disable contenteditable
	 */
	const handleBlur = () => {
		if (!text.current) {
			alert("Label cannot be empty");
			text.current = value;
			return false;
		}
		// disable content editable
		setEditableDisabled(true);

		if (text.current !== value) {
			// update screen item in state and db
			updateScreenItem(activeScreen.screenId, activeScreenItem.itemId, { settings: { ...activeScreenItem.settings, [labelKey]: text.current } });
		}

		// set active screen item to current item
		setActiveScreenItem({ ...activeScreenItem, settings: { ...activeScreenItem.settings, [labelKey]: text.current } });

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
		const keyCode = event.code;

		if (keyCode === "Enter") {
			event.returnValue = false;
			if (event.preventDefault) {
				event.preventDefault();
			}

			handleBlur();
		}
	};

	return (
		<ContentEditable
			innerRef={editableContent}
			html={text.current}
			onBlur={handleBlur}
			onChange={handleChange}
			className="screen-item"
			tagName="span"
			disabled={editableDisabled}
			onDoubleClick={() => {
				// turn on content editable
				setEditableDisabled(false);

				// set active screen item to current item
				// setActiveScreenItem(...activeScreenItem);

				// disable moveable
				setMoveableDisabled(true);

				setTimeout(() => {
					editableContent.current.focus();
				}, 200);
			}}
			onPaste={pastePlaintext}
			onKeyPress={disableNewlines}
		/>
	);
}
