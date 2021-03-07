export default function AnswerOption({ index, answer, answerItemStyle }) {
	const answerChoices = ["A", "B", "C", "D"];
	return (
		<div style={answerItemStyle}>
			<div>{answerChoices[index]}</div>
			<div>{answer}</div>
		</div>
	);
}
