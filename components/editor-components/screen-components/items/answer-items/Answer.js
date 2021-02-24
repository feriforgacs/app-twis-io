import styles from "./Answer.module.scss";

export default function Answer({ answer, index, correct, setCorrectAnswer, answerItemStyle }) {
	const answerChoices = ["A", "B", "C", "D"];

	let currentItemstyle = { ...answerItemStyle };

	if (correct) {
		currentItemstyle = {
			...answerItemStyle,
			background: "#54ba00",
			color: "#fff",
		};
	}

	return (
		<div className={`screen-item ${styles.answerOption} ${correct ? styles.answerOptionCorrect : ""}`} style={currentItemstyle}>
			<div
				className={`screen-item ${styles.choice} ${correct ? styles.choiceCorrect : ""}`}
				onClick={() => {
					if (!correct) {
						setCorrectAnswer(index);
					}
				}}
			>
				{correct ? (
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
						<polyline points="20 6 9 17 4 12"></polyline>
					</svg>
				) : (
					answerChoices[index]
				)}
			</div>
			<div className={`screen-item ${styles.optionText}`}>{answer}</div>
		</div>
	);
}
