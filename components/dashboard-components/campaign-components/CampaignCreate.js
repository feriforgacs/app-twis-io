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
			</div>
		</div>
	);
}
