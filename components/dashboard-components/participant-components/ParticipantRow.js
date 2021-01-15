import { useState, useRef, useEffect } from "react";
import { format } from "date-fns";
import Link from "next/link";
import Modal from "../Modal";

export default function ParticipantRow({ id, name = "", email = "", campaignId, campaignName, createdAt, index, setToastMessage, setToastType, setToastDuration, setToastVisible, removeParticipant }) {
	const [navigationVisible, toggleNavigationVisible] = useState(false);
	const [selectedParticipantId, setSelectedParticipantId] = useState();
	const [selectedParticipantCampaignId, setSelectedParticipantCampaignId] = useState();
	const [modalVisible, setModalVisible] = useState(false);
	const [deleteLoading, setDeleteLoading] = useState(false);

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

	const deleteParticipant = async () => {
		setDeleteLoading(true);

		const participantDeleteRequest = await fetch(`${process.env.APP_URL}/api/participants/delete`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				id: selectedParticipantId,
				campaignId: selectedParticipantCampaignId,
			}),
		});

		const participant = await participantDeleteRequest.json();

		setDeleteLoading(false);

		if (participant.success !== true) {
			// error
			setModalVisible(false);
			setToastMessage("Can't delete participant. Please, try again.");
			setToastType("error");
			setToastDuration(6000);
			setToastVisible(true);
			return;
		} else {
			setModalVisible(false);
			setToastMessage("Participant has been deleted");
			setToastType("default");
			setToastDuration(3000);
			setToastVisible(true);
			removeParticipant(index);
			return;
		}
	};

	const displayConfirmDelete = (participantId, campaignId) => {
		toggleNavigationVisible(false);
		setSelectedParticipantId(participantId);
		setSelectedParticipantCampaignId(campaignId);
		setModalVisible(true);
	};

	return (
		<tr className={`participant-list__item ${modalVisible || navigationVisible ? "participant-list__item--active" : ""}`}>
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
					<a href={`mailto:${email}`} target="_blank" rel="noopener noreferrer" title={`Send email to ${email}`}>
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
						<button className="button button--dropdown color--error" onClick={() => displayConfirmDelete(id, campaignId)}>
							Delete Participant
						</button>
					</div>
				)}

				{modalVisible && <Modal title="Are you sure you want to delete the participant?" body={`⚠️ When you remove a participant, their answers will be deleted as well and there is no option to restore the collected information. ⚠️`} primaryAction={deleteParticipant} primaryActionLabel="Yes, delete participant" secondaryAction={() => setModalVisible(false)} secondaryActionLabel="Cancel" onClose={() => setModalVisible(false)} loading={deleteLoading} />}
			</td>
		</tr>
	);
}
