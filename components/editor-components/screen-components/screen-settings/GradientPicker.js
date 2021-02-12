import Gradients from "../../../../utils/Gradients";

export default function GradientPicker({ onSelect }) {
	return (
		<div>
			{Gradients.map((gradient, index) => (
				<button style={{ background: gradient }} key={index} onClick={onSelect}>
					x
				</button>
			))}
		</div>
	);
}
