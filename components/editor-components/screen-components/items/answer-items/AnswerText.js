import { useContext, useState, useRef } from "react";
import { GlobalContext } from "../../../../../context/GlobalState";
import ContentEditable from "react-contenteditable";
import CleanString from "../../../../../helpers/CleanString";

export default function AnswerText({ answer, index }) {
	const { activeScreen, activeScreenItem, setActiveScreenItem, updateScreenItem, setMoveableDisabled } = useContext(GlobalContext);
	const [editableDisabled, setEditableDisabled] = useState(true);

	const text = useRef(answer);
	const editableContent = useRef();

	const handleChange = (event) => {
		text.current = CleanString(event.target.value);
	};

	/**
	 * Update state on blur and disable contenteditable
	 */
	const handleBlur = () => {
		if (!text.current) {
			alert("Answer option cannot be empty");
			text.current = answer;
			return;
		}
		// disable content editable
		setEditableDisabled(true);

		const answers = [...activeScreenItem.settings.answers];
		answers[index].option = text.current;

		if (text.current !== answer) {
			// update screen item in state and db
			updateScreenItem(activeScreen.screenId, activeScreenItem.itemId, { settings: { ...activeScreenItem.settings, answers } });
		}

		// set active screen item to current item
		setActiveScreenItem({ ...activeScreenItem, settings: { ...activeScreenItem.settings, answers } });

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
