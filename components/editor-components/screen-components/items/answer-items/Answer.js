import styles from "./Answer.module.scss";

export default function Answer({ answer, index, correct, setCorrectAnswer }) {
	const answerChoices = ["A", "B", "C", "D"];
	return (
		<div className={`screen-item ${styles.answerOption}`}>
			<span className={`screen-item ${styles.choice}`}>{answerChoices[index]}</span>
			<span className={`screen-item ${styles.optionText}`}>{answer}</span>
		</div>
	);
}
