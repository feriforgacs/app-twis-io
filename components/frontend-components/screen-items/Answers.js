import { useContext, useEffect, useState } from "react";
import { FrontendContext } from "../../../context/frontend/FrontendState";
import AnswerOption from "./answer-items/AnswerOption";
import SuccessConfetti from "./answer-items/SuccessConfetti";

export default function Answers({ data, lastScreenIndex }) {
	const { gotoNextScreen, gotoPreviousScreen, updateState } = useContext(FrontendContext);
	const [showResult, setShowResult] = useState(false);
	const [noStep, setNoStep] = useState(true);
	const [success, setSuccess] = useState(false);

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
		<div style={answersStyle}>
			{data.settings.answers.map((answer, index) => (
				<AnswerOption key={index} answer={answer} index={index} correct={index === data.settings.correctAnswer} answerItemStyle={answerItemStyle} itemSettings={data} />
			))}
			{success && <SuccessConfetti successEmoji={data.settings.successEmoji || ""} />}
		</div>
	);
}
