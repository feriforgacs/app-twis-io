import { useDrag } from "react-dnd";
import { ItemTypes } from "../../../../utils/Items";
import styles from "../ElementOptions.module.scss";

export default function Button({ button }) {
	const [{ isDragging }, drag] = useDrag({
		item: {
			type: ItemTypes.BUTTON,
			content: button.content,
			settings: button.settings,
		},
		collect: (monitor) => ({
			isDragging: !!monitor.isDragging(),
		}),
	});

	let buttonStyle = {
		background: !button.settings.classNames.includes("outlined") ? button.settings.highlightColor.backgroundColor : "none",
		borderStyle: button.settings.classNames.includes("outlined") ? "solid" : "none",
		borderWidth: button.settings.classNames.includes("outlined") ? "2px" : "0",
		borderColor: button.settings.classNames.includes("outlined") ? button.settings.highlightColor.backgroundColor : "none",
		textAlign: button.settings.align,
	};

	let buttonTextStyle = {
		fontFamily: button.settings.fontFamily,
		fontSize: `${button.settings.fontSize}px`,
		color: `rgba(${button.settings.color.r}, ${button.settings.color.g}, ${button.settings.color.b}, ${button.settings.color.a})`,
		fontWeight: button.settings.bold ? 700 : 400,
		fontStyle: button.settings.italic ? `italic` : `normal`,
		textDecoration: button.settings.underline ? `underline` : `none`,
		textTransform: button.settings.uppercase ? `uppercase` : `none`,
	};

	return (
		<div ref={drag} className={`${styles.optionButton} ${styles.option} ${isDragging && "item--dragged"} ${button.settings.classNames}`} style={buttonStyle}>
			<span style={buttonTextStyle}>{button.content}</span>
		</div>
	);
}
