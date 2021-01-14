import { useState } from "react";
import Button from "../Button";

export default function CampaignSearch({ loading = false, filterCampaigns, filterReset }) {
	const [keyword, setKeyword] = useState();
	return (
		<div id="campaign-search">
			<div id="campaign-search__form" className="form form--search form--inline">
				<div className="form__group form__group--input">
					<input className="form__input form__input--search" type="text" name="search" value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="Find campaigns" disabled={loading} />
					{keyword && (
						<button className="button--clear" onClick={() => filterReset()}>
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
								<circle cx="12" cy="12" r="10"></circle>
								<line x1="15" y1="9" x2="9" y2="15"></line>
								<line x1="9" y1="9" x2="15" y2="15"></line>
							</svg>
						</button>
					)}
				</div>
				<div className="form__group">
					<Button type="outline-primary" label="Search" disabled={loading || !keyword} loading={loading} onClick={() => filterCampaigns(keyword)} />
				</div>
			</div>
		</div>
	);
}
