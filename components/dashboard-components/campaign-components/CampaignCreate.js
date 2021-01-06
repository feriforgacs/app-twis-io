import { useState } from "react";
import { format } from "date-fns";

export default function CampaignCreate() {
	const [name, setName] = useState(`My Campaign - ${format(new Date(), "yyyy.MM.dd.")}`);
	const [type, setType] = useState("quiz");
	const [loading, setLoading] = useState(false);

	return (
		<div id="campaign-create">
			<div id="campaign-create__form" className="form">
				<div className="form__section">
					<div className="form__group">
						<label className="form__label" htmlFor="name">
							Campaign Name
						</label>

						<input type="text" name="name" id="name" value={name} onChange={(e) => setName(e.target.value)} maxLength="250" disabled={loading} />
						<p className="form__info-text">This is just an information for you so later you can easily identify your campaign. It won't be visible for the visitors of your campaign.</p>
					</div>
				</div>

				<div className="form__section">
					<label className="form__label">Campaign Type</label>

					<div className="campaign-type-options">
						<div className={`campaign-type-option ${type == "quiz" ? "campaign-type-option--selected" : ""}`}>
							<div className="campaign-type-option__icon"></div>
							<div className="campaign-type-option__description">
								<h4>Quiz</h4>
								<p>Select this option to create a simple quiz campaign where players should choose the right answers from different options to claim their prize.</p>
							</div>
						</div>

						<div className={`campaign-type-option ${type == "swipequiz" ? "campaign-type-option--selected" : ""}`}>
							<div className="campaign-type-option__icon"></div>
							<div className="campaign-type-option__description">
								<h4>Swipe Quiz</h4>
								<p>Select this option to create a swipe quiz campaign where participants should decide whether something is true or false to claim their reward.</p>
							</div>
						</div>

						<div className={`campaign-type-option ${type == "memory" ? "campaign-type-option--selected" : ""}`}>
							<div className="campaign-type-option__icon"></div>
							<div className="campaign-type-option__description">
								<h4>Memory</h4>
								<p>Select this option to create a campaign where participants should complete a short memory game to claim their reward.</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
