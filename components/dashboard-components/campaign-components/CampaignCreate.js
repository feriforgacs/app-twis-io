import { useState } from "react";
import { format } from "date-fns";
import CreateCampaignOption from "./CampaignCreateOption";

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

						<input type="text" className="form__input" name="name" id="name" value={name} onChange={(e) => setName(e.target.value)} maxLength="250" disabled={loading} />
						<p className="form__info-text">This is just an information for you so later you can easily identify your campaign. It won't be visible for the visitors of your campaign.</p>
					</div>
				</div>

				<div className="form__section">
					<label className="form__label">Campaign Type</label>

					<div className="campaign-type-options">
						<CreateCampaignOption name="Quiz" description="Select this option to create a simple quiz campaign where players should choose the right answers from different options to claim their prize." selected={type == "quiz"} onClick={() => setType("quiz")} />

						<CreateCampaignOption name="Swipe Quiz" description="Select this option to create a swipe quiz campaign where participants should decide whether something is true or false to claim their reward." selected={type == "swipequiz"} onClick={() => setType("swipequiz")} />

						<CreateCampaignOption name="Memory" description="Select this option to create a campaign where participants should complete a short memory game to claim their reward." selected={type == "memory"} onClick={() => setType("memory")} />
					</div>
				</div>

				<div className="form__section form__section--actions">
					<button className="button button--primary">Create Campaign</button>
				</div>
			</div>
		</div>
	);
}
