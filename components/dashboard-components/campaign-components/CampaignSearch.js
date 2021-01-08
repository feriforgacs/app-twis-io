import { useState } from "react";
import Button from "../Button";

export default function CampaignSearch({ campaignSearch, setCampaignSearch }) {
	const [loading, setLoading] = useState(false);
	return (
		<div id="campaign-search">
			<div id="campaign-search__form" className="form form--search form--inline">
				<div className="form__group form__group--input">
					<input className="form__input form__input--search" type="text" name="search" value={campaignSearch} onChange={(e) => setCampaignSearch(e.target.value)} placeholder="Find campaigns" />
				</div>
				<div className="form__group">
					<Button type="outline-primary" label="Search" disabled={loading} loading={loading} />
				</div>
			</div>
		</div>
	);
}
