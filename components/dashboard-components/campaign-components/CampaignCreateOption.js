export default function CampaignCreateOption({ name = "Provide a name", description = "Provide a description", selected = false, onClick = null, comingsoon = false, disabled = false }) {
	return (
		<div className={`campaign-type-option ${selected ? "campaign-type-option--selected" : ""} ${disabled ? "campaign-type-option--disabled" : ""}`} onClick={onClick}>
			<div className="campaign-type-option__icon"></div>
			<div className="campaign-type-option__description">
				<h4>
					{name} {comingsoon && <span className="campaign-type-option__coming-soon">Coming soon</span>}
				</h4>
				<p className="form__info-text">{description}</p>
			</div>
		</div>
	);
}
