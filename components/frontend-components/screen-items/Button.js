import { useContext } from "react";
import { FrontendContext } from "../../../context/frontend/FrontendState";

export default function Button({ data, lastScreenIndex }) {
	const { gotoNextScreen, gotoPreviousScreen, restartQuiz } = useContext(FrontendContext);
	let buttonStyle = {
		background: data.settings.highlightColor.backgroundColor,
		textAlign: data.settings.align,
		width: `${data.settings.width}px`,
		height: `${data.settings.height}px`,
		transform: `translateX(${data.settings.translateX}px) translateY(${data.settings.translateY}px) rotate(${data.settings.rotate}deg)`,
		top: `${data.settings.top}px`,
		left: `${data.settings.left}px`,
		opacity: typeof data.settings.opacity !== undefined ? data.settings.opacity : 1,
		zIndex: data.orderIndex,
		position: "absolute",
	};

	let buttonTextStyle = {
		color: `rgba(${data.settings.color.r}, ${data.settings.color.g}, ${data.settings.color.b}, ${data.settings.color.a})`,
		fontSize: `${data.settings.fontSize}px`,
		fontWeight: data.settings.bold ? 700 : 400,
		fontStyle: data.settings.italic ? `italic` : `normal`,
		textDecoration: data.settings.underline ? `underline` : `none`,
		textTransform: data.settings.uppercase ? `uppercase` : `none`,
	};

	const fontFamilyClass = data.settings.fontFamily !== "" ? `font--${data.settings.fontFamily}` : `font--arial`;

	const buttonActionType = data.settings.action ? data.settings.action : "";

	const handleClick = () => {
		let actionURL = data.settings.actionURL ? data.settings.actionURL : "";

		// check http or https prefix at the beginning of the url
		if (actionURL.indexOf("http://") !== 0 || actionURL.indexOf("https://") !== 0) {
			actionURL = `https://${actionURL}`;
		}
		switch (buttonActionType) {
			case "nextscreen":
				// go to next screen
				gotoNextScreen(lastScreenIndex);
				break;

			case "previousscreen":
				// go to previous screen
				gotoPreviousScreen();
				break;

			case "restart":
				// go to first screen and reset answers
				restartQuiz();
				break;

			case "url":
				// go to url
				if (actionURL) {
					Object.assign(document.createElement("a"), { target: "_blank", href: actionURL }).click();
				}
				break;

			default:
				// go to next screen
				gotoNextScreen(lastScreenIndex);
				break;
		}
	};

	return (
		<div className={`no-step ${fontFamilyClass} ${data.settings.classNames ? data.settings.classNames : ""}`} style={buttonStyle} onClick={() => handleClick()}>
			<span className="no-step" style={buttonTextStyle}>
				{data.content}
			</span>
		</div>
	);
}
