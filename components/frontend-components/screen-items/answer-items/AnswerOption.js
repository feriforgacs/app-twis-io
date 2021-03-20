import styles from "./AnswerOption.module.scss";

export default function AnswerOption({ index, answer, answerItemStyle, onClick, selectedAnswer, answered }) {
	const answerChoices = ["A", "B", "C", "D"];

	let currentItemstyle = { ...answerItemStyle };

	if (answer.correct && selectedAnswer.correct) {
		currentItemstyle = {
			...answerItemStyle,
			background: "#54ba00",
			color: "#fff",
		};
	}

	if (answer.option === selectedAnswer.option && !selectedAnswer.correct) {
		currentItemstyle = {
			...answerItemStyle,
			background: "#f24e4e",
			color: "#fff",
		};
	}

	// choice icon background
	const choiceBackground = selectedAnswer ? "#fff" : "transparent";

	return (
		<div className={styles.answerOption} style={currentItemstyle} onClick={onClick}>
			<div
				className={styles.choice}
				style={{
					background: choiceBackground,
				}}
			>
				{answer.correct && answered && (
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#54ba00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
						<polyline points="20 6 9 17 4 12"></polyline>
					</svg>
				)}
				{!answer.correct && answered && (
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f24e4e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
						<line x1="18" y1="6" x2="6" y2="18"></line>
						<line x1="6" y1="6" x2="18" y2="18"></line>
					</svg>
				)}
				{!answered && answerChoices[index]}
			</div>
			<div className={styles.optionText}>{answer.option}</div>
		</div>
	);
}
