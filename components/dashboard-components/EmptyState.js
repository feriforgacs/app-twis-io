export default function EmptyStateCampaigns({ title = "Please, provide a title", description = "Please, provide a description", action = null, actionLabel = "", helpURL = "", helpLabel = "Learn more", illustration = "" }) {
	return (
		<div className="empty-state">
			<div className="empty-state__body">
				<h4>{title}</h4>

				<p className="empty-state__copy">{description}</p>
				{action && (
					<button className="button button--primary button--autowidth" onClick={(e) => action()}>
						{actionLabel}
					</button>
				)}
				{helpURL && (
					<div className="empty-state__help">
						<a href={helpURL} target="_blank" rel="noopener noreferrer">
							{helpLabel}
						</a>
					</div>
				)}
			</div>
			{illustration && (
				<div className="empty-state__illustration">
					<img src={`/images/empty-states/${illustration}.png`} />
				</div>
			)}
		</div>
	);
}
