import { useDrag } from "react-dnd";
import { ItemTypes } from "../../../../utils/Items";
import styles from "../ElementOptions.module.scss";

export default function Text({ text }) {
	const [{ isDragging }, drag] = useDrag({
		item: {
			type: ItemTypes.TEXT,
			content: text.content,
			settings: text.settings,
		},
		collect: (monitor) => ({
			isDragging: !!monitor.isDragging(),
		}),
	});

	let textStyle = {
		fontFamily: text.settings.fontFamily,
		fontSize: `${text.settings.fontSize}px`,
		color: "#ffffff", // this is necessary to make the text content "visible" on the sidebar, when the item get's dropped on the screen, it'll use the color that was defined in item.settings
		textAlign: text.settings.align,
		fontWeight: text.settings.bold ? 700 : 400,
		fontStyle: text.settings.italic ? `italic` : `normal`,
		textDecoration: text.settings.underline ? `underline` : `none`,
	};

	return (
		<div ref={drag} className={`${styles.optionText} ${styles.option} ${isDragging && "item--dragged"} ${text.settings.classNames}`} style={textStyle}>
			<span>{text.content}</span>
		</div>
	);
}
