import Link from "next/link";

export default function PageActionsHeader({ infoText = "", infoActionLabel = "", infoActionURL = "", primaryActionLabel = "", primaryActionURL = "", secondaryActionLabel = "", secondaryActionURL = "" }) {
	return (
		<div className="section page__actions page__actions--header">
			<div className="info">
				{infoText && <p>{infoText}</p>}
				{infoActionLabel && infoActionURL && (
					<div className="section__action">
						<Link href={infoActionURL}>
							<a>{infoActionLabel}</a>
						</Link>
					</div>
				)}
			</div>

			<div className="actions">
				{secondaryActionLabel && secondaryActionURL && (
					<Link href={secondaryActionURL}>
						<a className="button button--link button--slim">{secondaryActionLabel}</a>
					</Link>
				)}
				{primaryActionLabel && primaryActionURL && (
					<Link href={primaryActionURL}>
						<a className="button button--primary button--slim">{primaryActionLabel}</a>
					</Link>
				)}
			</div>
		</div>
	);
}
