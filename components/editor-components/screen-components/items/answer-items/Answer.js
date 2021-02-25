import { useContext } from "react";
import { GlobalContext } from "../../../../../context/GlobalState";
import AnswerText from "./AnswerText";
import styles from "./Answer.module.scss";

export default function Answer({ answer, index, correct, setCorrectAnswer, answerItemStyle, screenItemActive }) {
	const { activeScreen, activeScreenItem, setActiveScreenItem, updateScreenItem } = useContext(GlobalContext);

	const answerChoices = ["A", "B", "C", "D"];

	let currentItemstyle = { ...answerItemStyle };

	if (correct && screenItemActive) {
		currentItemstyle = {
			...answerItemStyle,
			background: "#54ba00",
			color: "#fff",
		};
	}

	return (
		<>
			<div className={`screen-item ${styles.answerOption} ${correct ? styles.answerOptionCorrect : ""}`} style={currentItemstyle}>
				<div
					className={`screen-item ${styles.choice} ${correct && screenItemActive ? styles.choiceCorrect : ""}`}
					onClick={() => {
						if (!correct) {
							setCorrectAnswer(index);
							updateScreenItem(activeScreen.screenId, activeScreenItem.itemId, { settings: { ...activeScreenItem.settings, correctAnswer: index } });
							setActiveScreenItem({ ...activeScreenItem, settings: { ...activeScreenItem.settings, correctAnswer: index } });
						}
					}}
				>
					{correct && screenItemActive ? (
						<svg className="screen-item" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
							<polyline className="screen-item" points="20 6 9 17 4 12"></polyline>
						</svg>
					) : (
						answerChoices[index]
					)}
				</div>
				<div className={`screen-item ${styles.optionText}`}>
					<AnswerText answer={answer} index={index} />
				</div>
			</div>
		</>
	);
}
