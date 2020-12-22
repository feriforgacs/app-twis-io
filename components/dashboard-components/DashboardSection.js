import Link from "next/link";

export default function DashboardSection({ id, title = "", actionURL = "", actionLabel = "" }) {
	return (
		<section id={`dashboard__${id}`}>
			<header className="section__header">
				<h2 className="section__title">{title}</h2>
				{actionURL && actionLabel ? (
					<div className="section__action">
						<Link href={actionURL}>
							<a>{actionLabel}</a>
						</Link>
					</div>
				) : (
					""
				)}
			</header>
		</section>
	);
}
