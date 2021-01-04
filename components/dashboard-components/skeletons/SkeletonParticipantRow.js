export default function SkeletonParticipantRow({ items = 1 }) {
	let skeletons = [];
	for (let i = 0; i < items; i++) {
		skeletons.push(
			<div key={i} className="campaign-card">
				<div className="campaign-card__header campaign-card__section">
					<p className="skeleton skeleton--card-title"></p>
				</div>

				<div className="campaign-card__body campaign-card__section">
					<div className="campaign-card__meta">
						<span className="badge badge--info badge--campaign-type skeleton"></span>
						<span className="campaign-status badge skeleton"></span>
						<span className="campaign-participant-count skeleton"></span>
					</div>

					<div className="campaign-card__info">
						<p className="campaign-visible-from campaign-info skeleton skeleton--text"></p>
						<span className="mt-5 block"></span>
						<p className="campaign-visible-to campaign-info skeleton skeleton--text"></p>
					</div>
				</div>

				<div className="campaign-card__footer campaign-card__section">
					<button className="button skeleton skeleton--button"></button>
				</div>
			</div>
		);
	}
	return skeletons;
}
