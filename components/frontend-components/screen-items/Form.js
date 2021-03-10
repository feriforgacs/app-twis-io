import styles from "./Form.module.scss";

export default function Form({ data }) {
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
		<div className={`no-step ${styles.form} ${fontFamilyClass}`} style={formStyle}>
			<div className={`no-step ${styles.formBody}`}>
				{data.settings.collectName && (
					<div className={`no-step ${styles.formGroup}`}>
						<label className={`no-step ${styles.formLabel}`}>{data.settings.labelName || "Name"}</label>
						<input type="text" className={`no-step ${styles.formInput}`} />
					</div>
				)}

				{data.settings.collectEmail && (
					<div className={`no-step ${styles.formGroup}`}>
						<label className={`no-step ${styles.formLabel}`}>{data.settings.labelEmail || "Email address"}</label>
						<input type="email" className={`no-step ${styles.formInput}`} />
					</div>
				)}

				<div className={`no-step ${styles.formGroup}`}>
					<label className={`no-step ${styles.labelLegal}`}>
						<input type="checkbox" className={`no-step ${styles.legalCheckbox}`} />
						<a href={data.settings.legalURL} target="_blank" rel="noopener noreferrer" style={{ color: formStyle.color }} className={`no-step `}>
							{data.settings.labelTerms || "I've read and accept the terms & conditions"}
						</a>
					</label>
				</div>

				<div className={`no-step ${styles.formGroup}`}>
					<button className={`no-step ${styles.submitButton}`} style={buttonStyle}>
						{data.settings.labelSubmit || "Submit"}
					</button>
				</div>
			</div>
		</div>
	);
}
