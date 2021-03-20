import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { format } from "date-fns";
import Modal from "../Modal";

export default function ParticipantDetails({ participantData, participantAnswers, setToastMessage, setToastType, setToastDuration, setToastVisible }) {
	const [modalVisible, setModalVisible] = useState(false);
	const [deleteLoading, setDeleteLoading] = useState(false);
	const router = useRouter();

	const deleteParticipant = async () => {
		setDeleteLoading(true);

		try {
			const participantDeleteRequest = await fetch(`/api/participants/delete`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					id: participantData.participant._id,
					campaignId: participantData.participant.campaign._id,
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
				router.push("/participants");
				return;
			}
		} catch (error) {
			console.log(error);
			setDeleteLoading(false);
			setModalVisible(false);
			setToastMessage("Can't delete participant. Please, try again.");
			setToastType("error");
			setToastDuration(6000);
			setToastVisible(true);
		}
	};

	const displayConfirmDelete = () => {
		setModalVisible(true);
	};

	return (
		<>
			<div className="participant">
				<div className="participant__row">
					<div className="participant__cell">Campaign:</div>
					<div className="participant__cell">
						<Link href={`/editor/${participantData.participant.campaign._id}`}>
							<a title="View campaign in the editor">{participantData.participant.campaign.name}</a>
						</Link>
					</div>
				</div>
				<div className="participant__row">
					<div className="participant__cell">Created at:</div>
					<div className="participant__cell">{format(new Date(participantData.participant.createdAt), "yyyy.MM.dd. HH:mm:ss")}</div>
				</div>

				<div className="participant__row">
					<div className="participant__cell">Name:</div>
					<div className="participant__cell">{participantData.participant.name}</div>
				</div>

				<div className="participant__row">
					<div className="participant__cell">Email:</div>
					<div className="participant__cell">
						<a href={`mailto:${participantData.participant.email}`} target="_blank" rel="noopener noreferrer">
							{participantData.participant.email}
						</a>
					</div>
				</div>

				<div className="participant__row">
					<div className="participant__cell">Answers:</div>
					<div className="participant__cell">
						{participantAnswers.map((answer, index) => (
							<p className="answers" key={index}>
								<span className={`${answer.correct ? "correct" : "incorrect"}`}>
									{answer.correct ? (
										<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
											<polyline points="20 6 9 17 4 12"></polyline>
										</svg>
									) : (
										<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
											<line x1="18" y1="6" x2="6" y2="18"></line>
											<line x1="6" y1="6" x2="18" y2="18"></line>
										</svg>
									)}
								</span>
								<span>{answer.option}</span>
							</p>
						))}
					</div>
				</div>

				<div className="participant__row actions">
					<Link href={`/campaigns/participants/${participantData.participant.campaign._id}`}>
						<a>View all participants in this campaign</a>
					</Link>

					<Link href="/participants">
						<a>Back to all participants</a>
					</Link>
				</div>
			</div>

			<div className="participant__actions">
				<button className="button button--outline button--link" onClick={() => displayConfirmDelete()} disabled={deleteLoading}>
					Delete participant
				</button>
			</div>

			{modalVisible && <Modal title="Are you sure you want to delete the participant?" body={`⚠️ When you remove a participant, their answers will be deleted as well and there is no option to restore the collected information. ⚠️`} primaryAction={deleteParticipant} primaryActionLabel="Yes, delete participant" secondaryAction={() => setModalVisible(false)} secondaryActionLabel="Cancel" onClose={() => setModalVisible(false)} loading={deleteLoading} />}
		</>
	);
}
