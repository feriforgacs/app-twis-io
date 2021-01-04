import Link from "next/link";

export default function ParticipantRow({ id, name = "", email = "", campaignId, campaignName, createdAt }) {
	return (
		<tr className="participant-list__item">
			<td className="item__created">
				<Link href={`/participant/${id}`}>
					<a title="View participant info">{createdAt}</a>
				</Link>
			</td>
			<td className={`item__name`}>
				<Link href={`/participant/${id}`}>
					<a title="View participant info">{name ? name : <span className="not-provided">Not provided</span>}</a>
				</Link>
			</td>
			<td className={`item__email`}>
				{email ? (
					<a href={`mailto:${email}`} target="_blank" rel="noopener noreferrer">
						{email}
					</a>
				) : (
					<span className="not-provided">Not provided</span>
				)}
			</td>
			<td className="item__campaign">{campaignName}</td>
			<td></td>
		</tr>
	);
}
