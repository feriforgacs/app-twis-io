import { useContext, useState } from "react";
import { GlobalContext } from "../../../../context/GlobalState";
import styles from "./Answers.module.scss";
import Answer from "./answer-items/Answer";

export default function Answers({ data }) {
	const { activeScreenItem, setActiveScreenItem } = useContext(GlobalContext);
	const screenItemActive = activeScreenItem.itemId === data.itemId;

	const [correctAnswer, setCorrectAnswer] = useState(data.settings.correctAnswer || 0);

	let answersStyle = {
		height: `${data.settings.height || 0}px`,
		width: `${data.settings.width || 0}px`,
		top: `${data.settings.top || 0}px`,
		left: `${data.settings.left || 0}px`,
		transform: `translateX(${data.settings.translateX || 0}px) translateY(${data.settings.translateY || 0}px) rotate(${data.settings.rotate || 0}deg)`,
		textAlign: data.settings.align,
		fontSize: `${data.settings.fontSize}px`,
		fontWeight: data.settings.bold ? 700 : 400,
		fontStyle: data.settings.italic ? `italic` : `normal`,
		textDecoration: data.settings.underline ? `underline` : `none`,
		textTransform: data.settings.uppercase ? `uppercase` : `none`,
		opacity: typeof data.settings.opacity !== undefined ? data.settings.opacity : 1,
		zIndex: data.orderIndex,
		position: "absolute",
	};

	let answerItemStyle = {
		background: data.settings.highlightColor.backgroundColor,
		color: `rgba(${data.settings.color.r}, ${data.settings.color.g}, ${data.settings.color.b}, ${data.settings.color.a})`,
	};

	if (screenItemActive) {
		answersStyle.cursor = "move";
	}
	return (
		<>
			<div onClick={() => setActiveScreenItem(data)} id={`${data.type}-${data.itemId}`} className={`screen-item ${styles.answers}`} style={answersStyle}>
				<div className={`screen-item ${styles.answerItem}`} style={answerItemStyle}>
					{data.settings.answers.map((answer, index) => (
						<Answer key={index} answer={answer} index={index} correct={index === correctAnswer} setCorrectAnswer={setCorrectAnswer} />
					))}
				</div>
			</div>
		</>
	);
}
