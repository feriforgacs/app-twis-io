import { DebounceInput } from "react-debounce-input";
import Gradients from "../../../../utils/Gradients";
import styles from "./GradientPicker.module.scss";

export default function GradientPicker({ onSelect, background = "" }) {
	return (
		<div className={styles.gradientPickerContainer}>
			<div className={styles.gradientSampleButtons}>
				{Gradients.map((gradient, index) => (
					<button className={`${styles.gradientSampleButton} ${gradient === background ? styles.gradientSampleButtonActive : ""}`} style={{ background: gradient }} key={index} onClick={() => onSelect(gradient)}></button>
				))}
			</div>

			<div className={styles.customBackgroundContainer}>
				<label className={styles.customBackgroundLabel}>Custom</label>
				<DebounceInput className={styles.customBackgroundInput} value={background} debounceTimeout="300" onChange={(e) => onSelect(e.target.value)} />
			</div>
		</div>
	);
}
