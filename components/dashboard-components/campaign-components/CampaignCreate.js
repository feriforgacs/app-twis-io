import { useState } from "react";
import { format } from "date-fns";
import Link from "next/link";
import CreateCampaignOption from "./CampaignCreateOption";
import Button from "../Button";

export default function CampaignCreate() {
	const [name, setName] = useState(`My Campaign - ${format(new Date(), "yyyy.MM.dd.")}`);
	const [type, setType] = useState("quiz");
	const [loading, setLoading] = useState(false);

	const [invalidFields, setInvalidFields] = useState([]);

	const checkRequiredInput = (key, value) => {
		let tempInvalidFields = [...invalidFields];
		if (!value.length && !tempInvalidFields.includes(key)) {
			tempInvalidFields.push(key);
		} else if (value.length) {
			if (tempInvalidFields.includes(key)) {
				tempInvalidFields.splice(tempInvalidFields.indexOf(key), 1);
			}
		}
		setInvalidFields(tempInvalidFields);
	};

	const handleNameChange = (value) => {
		setName(value);
		checkRequiredInput("name", value);
	};

	return (
		<>
			<div id="campaign-create">
				<div id="campaign-create__form" className="form">
					<div className="form__section">
						<div className="form__group">
							<label className="form__label" htmlFor="name">
								Campaign Name
							</label>

							<input type="text" className={`form__input form__input--text ${invalidFields.includes("name") && "form__input--invalid"}`} name="name" id="name" value={name} onChange={(e) => handleNameChange(e.target.value)} maxLength="250" disabled={loading} onBlur={() => checkRequiredInput("name", name)} />
							{invalidFields.includes("name") && (
								<p className="form__validation-error">
									<svg viewBox="0 0 20 20">
										<path d="M10 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm-1-8h2V6H9v4zm0 4h2v-2H9v2z"></path>
									</svg>
									<span>Campaign Name is required</span>
								</p>
							)}
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
						<Button label="Create Campaign" loading={loading} disabled={loading || invalidFields.length} type="primary" />
					</div>
				</div>
			</div>
			<Link href="/campaigns">
				<a className="button button--link button--back">Back to campaigns</a>
			</Link>
		</>
	);
}
