import styles from "./AnswerOption.module.scss";

export default function AnswerOption({ index, answer, answerItemStyle, onClick }) {
	const answerChoices = ["A", "B", "C", "D"];
	return (
		<div className={styles.answerOption} style={answerItemStyle} onClick={onClick}>
			<div className={styles.choice}>{answerChoices[index]}</div>
			<div className={styles.optionText}>{answer}</div>
		</div>
	);
}
