export default function CampaignCreateOption({ name = "Provide a name", description = "Provide a description", selected = false, onClick = null }) {
	return (
		<div className={`campaign-type-option ${selected ? "campaign-type-option--selected" : ""}`} onClick={onClick}>
			<div className="campaign-type-option__icon"></div>
			<div className="campaign-type-option__description">
				<h4>{name}</h4>
				<p className="form__info-text">{description}</p>
			</div>
		</div>
	);
}
