import { useState, useRef, useEffect } from "react";
import { format } from "date-fns";
import Link from "next/link";

export default function ParticipantRow({ id, name = "", email = "", campaignId, campaignName, createdAt }) {
	const [navigationVisible, toggleNavigationVisible] = useState(false);

	const componentRef = useRef(null);

	useEffect(() => {
		const handleClickOutSide = (event) => {
			if (componentRef.current && !componentRef.current.contains(event.target)) {
				if (navigationVisible) {
					toggleNavigationVisible(false);
				}
			}
		};

		document.addEventListener("mousedown", handleClickOutSide);

		return () => {
			document.removeEventListener("mousedown", handleClickOutSide);
		};
	}, [componentRef, navigationVisible]);

	return (
		<tr className="participant-list__item">
			<td className="item__created">
				<Link href={`/participants/${id}`}>
					<a title="View participant info">{format(new Date(createdAt), "yyyy.MM.dd. HH:mm:ss")}</a>
				</Link>
			</td>
			<td className={`item__name`}>
				<Link href={`/participants/${id}`}>
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
			<td>
				<button className="button button--card-navigation" onClick={() => toggleNavigationVisible(!navigationVisible)}>
					{!navigationVisible && <span>&hellip;</span>}

					{navigationVisible && (
						<svg viewBox="0 0 20 20">
							<path d="M11.414 10l6.293-6.293a.999.999 0 1 0-1.414-1.414L10 8.586 3.707 2.293a.999.999 0 1 0-1.414 1.414L8.586 10l-6.293 6.293a.999.999 0 1 0 1.414 1.414L10 11.414l6.293 6.293a.997.997 0 0 0 1.414 0 .999.999 0 0 0 0-1.414L11.414 10z"></path>
						</svg>
					)}
				</button>

				{navigationVisible && (
					<div className="campaign-card__navigation campaign-card__navigation--dropdown" ref={componentRef}>
						<Link href={`/participants/${id}`}>
							<a className="button button--dropdown">View Details</a>
						</Link>
						<button className="button button--dropdown color--error">Delete Participant</button>
					</div>
				)}
			</td>
		</tr>
	);
}
