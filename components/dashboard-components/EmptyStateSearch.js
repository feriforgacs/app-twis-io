export default function EmptyStateSearch({ title = "Provide a title", description = "Provide a description", illustration = "" }) {
	return (
		<div className="empty-state empty-state--search">
			<div className="empty-state__body">
				<h4>{title}</h4>

				<p className="empty-state__copy">{description}</p>
			</div>
			{illustration && (
				<div className="empty-state__illustration">
					<img src={`/images/empty-states/${illustration}.png`} />
				</div>
			)}
		</div>
	);
}
