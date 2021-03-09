/**
 * @todo check correct answer on click
 * @todo display success confetti or error
 * @todo add answer to global state
 */
import { useContext, useEffect, useState } from "react";
import { FrontendContext } from "../../../context/frontend/FrontendState";
import AnswerOption from "./answer-items/AnswerOption";
import SuccessConfetti from "./answer-items/SuccessConfetti";

export default function Answers({ data, lastScreenIndex }) {
	const { gotoNextScreen, updateState, answers, addAnswer } = useContext(FrontendContext);
	const [noStep, setNoStep] = useState(answers[data.itemId] ? false : true);
	const [success, setSuccess] = useState(answers[data.itemId] ? answers[data.itemId].correct : false);
	const [answered, setAnswered] = useState(answers[data.itemId] || false);

	/**
	 * Random order
	 * @param {array} arr Array to be randomized
	 */
	const getShuffledArr = (arr) => {
		const newArr = arr.slice();
		for (let i = newArr.length - 1; i > 0; i--) {
			const rand = Math.floor(Math.random() * (i + 1));
			[newArr[i], newArr[rand]] = [newArr[rand], newArr[i]];
		}
		return newArr;
	};

	const answerOptions = data.settings.answersRandomOrder ? getShuffledArr(data.settings.answers) : data.settings.answers;

	useEffect(() => {
		updateState("noStep", noStep);
	}, [noStep]);

	let answersStyle = {
		height: `${data.settings.height || 0}px`,
		width: `${data.settings.width || 0}px`,
		top: `${data.settings.top || 0}px`,
		left: `${data.settings.left || 0}px`,
		transform: `translateX(${data.settings.translateX || 0}px) translateY(${data.settings.translateY || 0}px) rotate(${data.settings.rotate || 0}deg)`,
		opacity: typeof data.settings.opacity !== undefined ? data.settings.opacity : 1,
		zIndex: data.orderIndex,
		position: "absolute",
	};

	let answerItemStyle = {
		background: data.settings.highlightColor.backgroundColor,
		color: `rgba(${data.settings.color.r}, ${data.settings.color.g}, ${data.settings.color.b}, ${data.settings.color.a})`,
		textAlign: data.settings.align,
		fontSize: `${data.settings.fontSize}px`,
		fontWeight: data.settings.bold ? 700 : 400,
		fontStyle: data.settings.italic ? `italic` : `normal`,
		textDecoration: data.settings.underline ? `underline` : `none`,
		textTransform: data.settings.uppercase ? `uppercase` : `none`,
	};

	const fontFamilyClass = data.settings.fontFamily !== "" ? `font--${data.settings.fontFamily}` : `font--arial`;

	return (
		<div style={answersStyle} className={fontFamilyClass}>
			{answerOptions.map((answer, index) => (
				<AnswerOption
					success={success}
					answered={answered}
					key={index}
					answer={answer}
					index={index}
					answerItemStyle={answerItemStyle}
					itemSettings={data}
					onClick={() => {
						// disable the option to submit an answer one more time
						if (answered) {
							gotoNextScreen(lastScreenIndex);
							return;
						}

						// add selected answer to state
						addAnswer(data.itemId, answer);

						// set success to true or false
						setSuccess(answer.correct);

						// set answered to true
						setAnswered(true);

						// allow to go to next screen on tap
						setNoStep(false);
					}}
				/>
			))}
			{success && <SuccessConfetti successEmoji={data.settings.successEmoji || ""} />}
		</div>
	);
}
