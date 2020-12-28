import { format } from "date-fns";
import Link from "next/link";

export default function CampaignCard({ id, name, type, status, participants, visibleFrom, visibleTo }) {
	return (
		<div className="campaign-card">
			<div className="campaign-card__header">
				<h4 className="campaign-card__title">
					<Link href={`/campaign/edit/${id}`} title={`Edit ${name}`}>
						<a>
							{name.substring(0, 22)}
							{name.length > 22 && "..."}
						</a>
					</Link>
				</h4>
			</div>
			<div className="campaign-card__body">
				<div className="campaign-card__meta">
					<span className="badge badge--info badge--campaign-type">{type}</span>
					<span className={`campaign-status badge ${status === "active" ? "badge--active badge--success" : "badge--inactive"}`}>{status === "active" ? "Active" : "Inactive"}</span>
					<Link href={`/participants/${id}`} className="campaign-participant-count">
						<a>
							{/* <img src={iconParticipants} alt={`${campaignName} - Participants`} /> */}
							Participants: <strong>{participants}</strong>
						</a>
					</Link>
				</div>

				<div className="campaign-card__info">
					<p className="campaign-visible-from campaign-info">
						{/* <img src={iconCalendar} alt="Camapign visible from" /> */}
						Visible from: <strong>{format(new Date(visibleFrom), "yyyy.MM.dd.")}</strong>
					</p>
					<p className="campaign-visible-to campaign-info">
						{/* <img src={iconCalendar} alt="Camapign visible to" /> */}
						Visible to: <strong>{format(new Date(visibleTo), "yyyy.MM.dd.")}</strong>
					</p>
				</div>
			</div>
			<div className="campaign-card__footer">Footer</div>
		</div>
	);
}
