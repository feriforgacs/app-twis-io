export default function SkeletonSearchForm({ items = 1 }) {
	let inputs = [];
	for (let i = 0; i < items; i++) {
		inputs.push(
			<div key={i} className="form__group form__group--input">
				<div className="skeleton skeleton--input skeleton--input-search" disabled="disabled"></div>
			</div>
		);
	}
	return (
		<div className="form form--search form--inline">
			{inputs}
			<div className="form__group">
				<button className="button skeleton skeleton--button skeleton--button-search"></button>
			</div>
		</div>
	);
}
