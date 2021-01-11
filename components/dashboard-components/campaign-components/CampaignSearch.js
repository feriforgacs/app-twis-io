import Button from "../Button";

export default function CampaignSearch({ campaignSearch, setCampaignSearch, loading = false, filterCampaigns }) {
	return (
		<div id="campaign-search">
			<div id="campaign-search__form" className="form form--search form--inline">
				<div className="form__group form__group--input">
					<input className="form__input form__input--search" type="text" name="search" value={campaignSearch} onChange={(e) => setCampaignSearch(e.target.value)} placeholder="Find campaigns" disabled={loading} />
				</div>
				<div className="form__group">
					<Button type="outline-primary" label="Search" disabled={loading} loading={loading} onClick={() => filterCampaigns()} />
				</div>
			</div>
		</div>
	);
}
