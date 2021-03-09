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

	return (
		<div className={styles.answerOption} style={currentItemstyle} onClick={onClick}>
			<div className={styles.choice}>{answerChoices[index]}</div>
			<div className={styles.optionText}>{answer.option}</div>
			{answer.correct && success ? "🟢" : "🛑"}
			{answered ? "👍" : "👎"}
		</div>
	);
}
