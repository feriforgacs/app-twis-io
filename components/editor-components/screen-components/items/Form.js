import { useContext } from "react";
import { GlobalContext } from "../../../../context/GlobalState";
import styles from "./Form.module.scss";
import Label from "./form-items/Label";

export default function Form({ data }) {
	const { activeScreenItem, setActiveScreenItem } = useContext(GlobalContext);
	const screenItemActive = activeScreenItem.itemId === data.itemId;

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

	if (screenItemActive) {
		formStyle.cursor = "move";
	}

	let buttonStyle = {
		background: data.settings.highlightColorButton.backgroundColor || "",
		color: `rgba(${data.settings.colorButton.r}, ${data.settings.colorButton.g}, ${data.settings.colorButton.b}, ${data.settings.colorButton.a})`,
	};

	return (
		<div onClick={() => setActiveScreenItem(data)} id={`${data.type}-${data.itemId}`} className={`screen-item ${styles.form}`} style={formStyle}>
			<div className={`screen-item ${styles.formBody}`}>
				{data.settings.collectName && (
					<div className={`screen-item ${styles.formGroup}`}>
						<label className={`screen-item ${styles.formLabel}`} title="Double click to edit">
							<Label labelKey="labelName" value={data.settings.labelName || "Name"} />
						</label>
						<input type="text" disabled placeholder="Petra" className={`screen-item ${styles.formInput}`} />
					</div>
				)}

				{data.settings.collectEmail && (
					<div className={`screen-item ${styles.formGroup}`}>
						<label className={`screen-item ${styles.formLabel}`}>
							<Label labelKey="labelEmail" value={data.settings.labelEmail || "Email address"} />
						</label>
						<input type="text" disabled placeholder="petra@twis.io" className={`screen-item ${styles.formInput}`} />
					</div>
				)}

				<div className={`screen-item ${styles.formGroup}`}>
					<label className={`screen-item ${styles.labelLegal}`}>
						<input type="checkbox" className={`screen-item ${styles.legalCheckbox}`} disabled />
						<Label labelKey="labelTerms" value={data.settings.labelTerms || "I've read and accept the terms & conditions"} />
					</label>
				</div>

				<div className={`screen-item ${styles.formGroup}`}>
					<button className={`screen-item ${styles.submitButton}`} style={buttonStyle}>
						<Label labelKey="labelSubmit" value={data.settings.labelSubmit || "Submit"} />
					</button>
				</div>
			</div>
		</div>
	);
}
