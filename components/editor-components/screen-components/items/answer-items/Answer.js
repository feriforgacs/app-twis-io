import styles from "./Answer.module.scss";

export default function Answer({ answer, index, correct, setCorrectAnswer, answerItemStyle }) {
	const answerChoices = ["A", "B", "C", "D"];
	return (
		<div className={`screen-item ${styles.answerOption}`} style={answerItemStyle}>
			<div className={`screen-item ${styles.choice}`}>{answerChoices[index]}</div>
			<div className={`screen-item ${styles.optionText}`}>{answer}</div>
		</div>
	);
}
