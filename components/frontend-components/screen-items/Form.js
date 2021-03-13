import { useContext, useEffect, useState } from "react";
import { FrontendContext } from "../../../context/frontend/FrontendState";
import styles from "./Form.module.scss";

export default function Form({ data }) {
	const { updateState } = useContext(FrontendContext);

	useEffect(() => {
		updateState("noStep", true);
	}, []);

	const [name, setName] = useState("");
	const [nameError, setNameError] = useState(false);

	const [email, setEmail] = useState("");
	const [emailError, setEmailError] = useState(false);

	const [legalAccepted, setLegalAccepted] = useState(false);
	const [legalError, setLegalError] = useState(false);

	const processForm = () => {
		let error = false;

		if (data.settings.collectName && !name) {
			setNameError(true);
			error = true;
		}

		if (data.settings.collectEmail && !email) {
			setEmailError(true);
			error = true;
		}

		if (!legalAccepted) {
			setLegalError(true);
			error = true;
		}

		if (error) {
			return;
		}

		if (data.settings.dataCollectionSuccessAction === "redirect" && data.settings.dataCollectionSuccessRedirectURL) {
			// redirect to defined URL
			let redirectURL = data.settings.dataCollectionSuccessRedirectURL;
			// check http or https prefix at the beginning of the url
			if (redirectURL.indexOf("http://") === -1 && redirectURL.indexOf("https://") === -1) {
				redirectURL = `https://${redirectURL}`;
			}
			window.top.location = redirectURL;
		} else {
			// display success popup
			updateState("formResult", { status: "success", dataCollectionSuccessPopupContent: data.settings.dataCollectionSuccessPopupContent, dataCollectionErrorMessage: data.settings.dataCollectionErrorMessage });
		}
	};

	let formStyle = {
		background: data.settings.highlightColor.backgroundColor,
		height: `${data.settings.height || 0}px`,
		width: `${data.settings.width || 0}px`,
		top: `${data.settings.top || 0}px`,
		left: `${data.settings.left || 0}px`,
		transform: `translateX(${data.settings.translateX || 0}px) translateY(${data.settings.translateY || 0}px) rotate(${data.settings.rotate || 0}deg)`,
		textAlign: data.settings.align,
		color: `rgba(${data.settings.color.r}, ${data.settings.color.g}, ${data.settings.color.b}, ${data.settings.color.a})`,
		fontSize: `${data.settings.fontSize}px`,
		fontWeight: data.settings.bold ? 700 : 400,
		fontStyle: data.settings.italic ? `italic` : `normal`,
		textDecoration: data.settings.underline ? `underline` : `none`,
		textTransform: data.settings.uppercase ? `uppercase` : `none`,
		opacity: typeof data.settings.opacity !== undefined ? data.settings.opacity : 1,
		zIndex: data.orderIndex,
		position: "absolute",
	};

	let buttonStyle = {
		background: data.settings.highlightColorButton.backgroundColor || "",
		color: `rgba(${data.settings.colorButton.r}, ${data.settings.colorButton.g}, ${data.settings.colorButton.b}, ${data.settings.colorButton.a})`,
	};

	const fontFamilyClass = data.settings.fontFamily !== "" ? `font--${data.settings.fontFamily}` : `font--arial`;

	return (
		<>
			<div className={`no-step ${styles.form} ${fontFamilyClass}`} style={formStyle}>
				<div className={`no-step ${styles.formBody}`}>
					{data.settings.collectName && (
						<div className={`no-step ${styles.formGroup} ${nameError ? styles.formGroupError : ""}`}>
							<label htmlFor="name" className={`no-step ${styles.formLabel}`}>
								{data.settings.labelName || "Name"}
							</label>
							<input
								id="name"
								type="text"
								value={name}
								onChange={(e) => {
									setName(e.target.value);
									if (e.target.value !== "") {
										setNameError(false);
									} else {
										setNameError(true);
									}
								}}
								className={`no-step ${styles.formInput}`}
							/>
						</div>
					)}

					{data.settings.collectEmail && (
						<div className={`no-step ${styles.formGroup} ${emailError ? styles.formGroupError : ""}`}>
							<label htmlFor="email" className={`no-step ${styles.formLabel}`}>
								{data.settings.labelEmail || "Email address"}
							</label>
							<input
								id="email"
								type="email"
								value={email}
								onChange={(e) => {
									setEmail(e.target.value);
									if (e.target.value !== "") {
										setEmailError(false);
									} else {
										setEmailError(true);
									}
								}}
								className={`no-step ${styles.formInput}`}
							/>
						</div>
					)}

					<div className={`no-step ${styles.formGroup} ${legalError ? styles.formGroupError : ""}`}>
						<label className={`no-step ${styles.labelLegal}`}>
							<input
								type="checkbox"
								className={`no-step ${styles.legalCheckbox}`}
								checked={legalAccepted}
								onChange={(e) => {
									setLegalAccepted(e.target.checked);
									if (e.target.checked) {
										setLegalError(false);
									} else {
										setLegalError(true);
									}
								}}
							/>
							<a href={data.settings.legalURL} target="_blank" rel="noopener noreferrer" style={{ color: formStyle.color }} className={`no-step `}>
								{data.settings.labelTerms || "I've read and accept the terms & conditions"}
							</a>
						</label>
					</div>

					<div className={`no-step ${styles.formGroup}`}>
						<button className={`no-step ${styles.submitButton}`} style={buttonStyle} onClick={() => processForm()}>
							{data.settings.labelSubmit || "Submit"}
						</button>
					</div>
				</div>
			</div>
		</>
	);
}
