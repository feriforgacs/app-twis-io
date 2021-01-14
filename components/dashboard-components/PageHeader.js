import Link from "next/link";

export default function PageHeader({ title = "Provide a title", primaryActionURL = "", primaryActionLabel = "", secondaryActionURL = "", secondaryActionLabel = "" }) {
	return (
		<header id="page__header">
			<h1 className="page__title">{title}</h1>
			{primaryActionURL && primaryActionLabel && (
				<div id="page__actions">
					<Link href={primaryActionURL}>
						<a className="button button--primary button--slim">{primaryActionLabel}</a>
					</Link>
				</div>
			)}

			{secondaryActionURL && secondaryActionLabel && (
				<div id="page__actions--secondary">
					<Link href={secondaryActionURL}>
						<a className="button button--link">{secondaryActionLabel}</a>
					</Link>
				</div>
			)}
		</header>
	);
}
