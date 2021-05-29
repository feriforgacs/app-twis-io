import { useState } from "react";
import { format } from "date-fns";
import { useRouter } from "next/router";
import Link from "next/link";
import CreateCampaignOption from "./CampaignCreateOption";
import Button from "../Button";
import Toast from "../Toast";
import PageActionsHeader from "../PageActionsHeader";

export default function CampaignCreate() {
	const router = useRouter();
	const [name, setName] = useState(`My Campaign - ${format(new Date(), "do MMM yyyy HH:mm")}`);
	const [type, setType] = useState("quiz");
	const [loading, setLoading] = useState(false);
	const [toastMessage, setToastMessage] = useState(false);
	const [toastVisible, setToastVisible] = useState(false);
	const [toastType, setToastType] = useState("default");
	const [toastDuration, setToastDuration] = useState(3000);

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

	const createCampaign = async () => {
		setLoading(true);

		try {
			const campaignCreateRequest = await fetch(`/api/campaigns/create`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name,
					type,
				}),
			});

			const campaign = await campaignCreateRequest.json();

			if (campaign.success !== true) {
				setLoading(false);
				// error
				setToastMessage("Can't create campaign. Please, try again.");
				setToastType("error");
				setToastDuration(6000);
				setToastVisible(true);
				return;
			}

			if (campaign.data) {
				// redirect to campaign editor
				router.push(`/editor/${campaign.data._id}`);
			}
		} catch (error) {
			console.log(error);
			setLoading(false);
			// error
			setToastMessage("Can't create campaign. Please, try again.");
			setToastType("error");
			setToastDuration(6000);
			setToastVisible(true);
		}
		return;
	};

	return (
		<>
			<PageActionsHeader infoActionURL="/campaigns" infoActionLabel="Back to campaigns" />
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
							<p className="form__info-text">This is just an information for you so later you can easily identify your campaign. It won&apos;t be visible for the visitors of your campaign.</p>
						</div>
					</div>

					<div className="form__section">
						<label className="form__label">Campaign Type</label>

						<div className="campaign-type-options">
							<CreateCampaignOption name="Quiz" description="Select this option to create a simple quiz campaign where players should choose the right answers from different options to claim their prize." selected={type == "quiz"} onClick={() => setType("quiz")} />

							<CreateCampaignOption name="Memory game" description="Select this option to create a simple memory game where participants should find the pairs to claim their reward." selected={type == "memory"} comingsoon={true} disabled={true} />

							{/* <CreateCampaignOption name="Swipe Quiz" description="Select this option to create a swipe quiz campaign where participants should decide whether something is true or false to claim their reward." selected={type == "swipequiz"} comingsoon={true} disabled={true} /> */}
						</div>
					</div>

					<div className="form__section form__section--actions">
						<Button label="Create Campaign" loading={loading} disabled={loading || invalidFields.length} type="primary" onClick={createCampaign} />
					</div>
				</div>
			</div>
			<Link href="/campaigns">
				<a className="button button--link button--back">Back to campaigns</a>
			</Link>

			{toastVisible && <Toast onClose={() => setToastVisible(false)} duration={toastDuration} type={toastType} content={toastMessage} />}
		</>
	);
}
