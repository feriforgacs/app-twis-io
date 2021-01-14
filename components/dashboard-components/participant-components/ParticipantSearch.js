import { useState, useEffect } from "react";
import Button from "../Button";
import Toast from "../Toast";

export default function ParticipantSearch({ participantCampaignId = 0, loading = false, filterParticipants, filterReset, hideCampaignSelect = false }) {
	const [campaigns, setCampaigns] = useState([]);
	const [campaignsLoading, setCampaignsLoading] = useState(true);
	const [toastMessage, setToastMessage] = useState(false);
	const [toastVisible, setToastVisible] = useState(false);
	const [toastType, setToastType] = useState("default");
	const [toastDuration, setToastDuration] = useState(3000);
	const [keyword, setKeyword] = useState("");
	const [campaignId, setCampaignId] = useState(participantCampaignId);

	/**
	 * Get campaigns from the database
	 */
	const getCampaigns = async () => {
		const campaignsRequest = await fetch(`${process.env.APP_URL}/api/campaigns?limit=99999&search=`, {
			method: "GET",
		});

		const campaigns = await campaignsRequest.json();

		setCampaignsLoading(false);

		if (campaigns.success !== true) {
			// error
			setToastMessage("Can't get campaigns. Please, try again.");
			setToastType("error");
			setToastDuration(6000);
			setToastVisible(true);
			return;
		}

		if (campaigns.data) {
			setCampaigns(campaigns.data);
		}
		return;
	};
	/**
	 * Get campaigns from the database on component load
	 */
	useEffect(() => {
		if (!hideCampaignSelect) {
			getCampaigns();
		}
	}, [hideCampaignSelect]);

	return (
		<>
			<div id="participant-search">
				<div id="campaign-search__form" className="form form--search form--inline">
					<div className="form__group form__group--input">
						<input className="form__input form__input--search" type="text" name="search" value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="Find by name or email address" disabled={loading} />
						{keyword && (
							<button
								className="button--clear"
								onClick={() => {
									setKeyword("");
									filterReset();
								}}
							>
								<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
									<circle cx="12" cy="12" r="10"></circle>
									<line x1="15" y1="9" x2="9" y2="15"></line>
									<line x1="9" y1="9" x2="15" y2="15"></line>
								</svg>
							</button>
						)}
					</div>
					{!hideCampaignSelect && (
						<div className="form__group form__group--select">
							<select className="form__select form__select--search" name="campaign" id="campaign" disabled={campaignsLoading} onChange={(e) => setCampaignId(e.target.value)} value={campaignId}>
								<option value="">All campaigns</option>
								{campaigns.length &&
									!campaignsLoading &&
									campaigns.map((campaignItem, key) => (
										<option key={key} value={campaignItem._id}>
											{campaignItem.name}
										</option>
									))}
							</select>
						</div>
					)}

					<div className="form__group">
						<Button type="outline-primary" label="Search" disabled={loading} loading={loading} onClick={() => filterParticipants(keyword, campaignId)} />
					</div>
				</div>
			</div>

			{toastVisible && <Toast onClose={() => setToastVisible(false)} duration={toastDuration} type={toastType} content={toastMessage} />}
		</>
	);
}
