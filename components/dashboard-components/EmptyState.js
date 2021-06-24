import Link from "next/link";
import Image from "next/image";

export default function EmptyStateCampaigns({ title = "Please, provide a title", description = "Please, provide a description", actionLink = "", actionLabel = "", helpURL = "", helpLabel = "Learn more", illustration = "" }) {
	return (
		<div className="empty-state">
			<div className="empty-state__body">
				<h4>{title}</h4>

				<p className="empty-state__copy">{description}</p>
				{actionLink && (
					<Link href={actionLink}>
						<a className="button button--primary button--autowidth">{actionLabel}</a>
					</Link>
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
					<Image src={`/images/empty-states/${illustration}.png`} width={450} height={450} />
				</div>
			)}
		</div>
	);
}
