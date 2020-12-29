import { useState, useRef, useEffect } from "react";
import { format } from "date-fns";
import Link from "next/link";
import Image from "next/image";

export default function CampaignCard({ id, name, type, status, participants, visibleFrom, visibleTo }) {
	const [navigationVisible, toggleNavigationVisible] = useState(false);

	const campaignCardNavigationRef = useRef(null);

	useEffect(() => {
		const handleClickOutSide = (event) => {
			if (campaignCardNavigationRef.current && !campaignCardNavigationRef.current.contains(event.target)) {
				if (navigationVisible) {
					toggleNavigationVisible(false);
				}
			}
		};

		document.addEventListener("mousedown", handleClickOutSide);

		return () => {
			document.removeEventListener("mousedown", handleClickOutSide);
		};
	}, [campaignCardNavigationRef, navigationVisible]);
	return (
		<div className="campaign-card">
			<div className="campaign-card__header campaign-card__section">
				<h4 className="campaign-card__title">
					<Link href={`/campaign/edit/${id}`} title={`Edit ${name}`}>
						<a>
							{name.substring(0, 22)}
							{name.length > 22 && "..."}
						</a>
					</Link>
				</h4>

				<button className="button button--card-navigation" onClick={() => toggleNavigationVisible(!navigationVisible)}>
					{!navigationVisible && <span>&hellip;</span>}

					{navigationVisible && (
						<svg viewBox="0 0 20 20">
							<path d="M11.414 10l6.293-6.293a.999.999 0 1 0-1.414-1.414L10 8.586 3.707 2.293a.999.999 0 1 0-1.414 1.414L8.586 10l-6.293 6.293a.999.999 0 1 0 1.414 1.414L10 11.414l6.293 6.293a.997.997 0 0 0 1.414 0 .999.999 0 0 0 0-1.414L11.414 10z"></path>
						</svg>
					)}
				</button>

				{navigationVisible && (
					<div className="campaign-card__navigation campaign-card__navigation--dropdown" ref={campaignCardNavigationRef}>
						<a href="/" target="_blank" rel="noopener noreferrer" className="button button--dropdown">
							View campaign
						</a>
						<button className="button button--dropdown">Duplicate Campaign</button>
						<button className="button button--dropdown color--error">Delete Campaign</button>
					</div>
				)}
			</div>
			<div className="campaign-card__body campaign-card__section">
				<div className="campaign-card__meta">
					<span className="badge badge--info badge--campaign-type">{type}</span>
					<span className={`campaign-status badge ${status === "active" ? "badge--active badge--success" : "badge--inactive"}`}>{status === "active" ? "active" : "inactive"}</span>
					<Link href={`/participants/${id}`}>
						<a className="campaign-participant-count">
							<span>
								<Image src="/images/icons/icon-participants.svg" width={15} height={15} alt={`${name} - Participants`} />
							</span>
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
			<div className="campaign-card__footer campaign-card__section">
				<Link href={`/campaign/edit/${id}`} title={`Edit ${name}`}>
					<a className="button button--outline">Edit Campaign</a>
				</Link>
			</div>
		</div>
	);
}
