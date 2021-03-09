/**
 * @todo display correct - incorrect answer if already answered
 */
import styles from "./AnswerOption.module.scss";

export default function AnswerOption({ index, answer, answerItemStyle, onClick, success, answered }) {
	const answerChoices = ["A", "B", "C", "D"];

	let currentItemstyle = { ...answerItemStyle };

	if (answer.correct && success) {
		currentItemstyle = {
			...answerItemStyle,
			background: "#54ba00",
			color: "#fff",
		};
	}

	if (answered && !success) {
		currentItemstyle = {
			...answerItemStyle,
			background: "#ff0000",
			color: "#fff",
		};
	}

	let successIconColor = "#ffffff";
	if (answer.correct && !success) {
		successIconColor = "#54ba00";
	}

	return (
		<div className={styles.answerOption} style={currentItemstyle} onClick={onClick}>
			<div className={styles.choice}>
				{answer.correct && answered && (
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={successIconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
						<polyline points="20 6 9 17 4 12"></polyline>
					</svg>
				)}
				{!answer.correct && answered && <i>x</i>}
				{!answered && answerChoices[index]}
			</div>
			<div className={styles.optionText}>{answer.option}</div>
		</div>
	);
}
