import { useEffect, useState } from "react";
import DashboardSection from "../DashboardSection";
import ParticipantRow from "./ParticipantRow";
import EmptyState from "../EmptyState";
import SkeletonParticipantList from "../skeletons/SkeletonParticipantList";
import Toast from "../Toast";

export default function ParticipantList({ limit = 10, dashboard = false }) {
	const [loading, setLoading] = useState(true);
	const [participants, setParticipants] = useState([]);
	const [participantLimit, setParticipantLimit] = useState(10);
	const [participantSearch, setParticipantSearch] = useState("");
	const [participantCampaignId, setParticipantCampaignId] = useState("");
	const [toastMessage, setToastMessage] = useState(false);
	const [toastVisible, setToastVisible] = useState(false);
	const [toastType, setToastType] = useState("default");
	const [toastDuration, setToastDuration] = useState(3000);

	/**
	 * Get participants from the database
	 */
	const getParticipants = async () => {
		const participantsRequest = await fetch(`${process.env.APP_URL}/api/participants?limit=${participantLimit}&search=${participantSearch}&campaign=${participantCampaignId}`, {
			method: "GET",
		});

		const participants = await participantsRequest.json();

		setLoading(false);

		if (participants.success !== true) {
			// error
			setToastMessage("Can't get participants. Please, try again.");
			setToastType("error");
			setToastDuration(6000);
			setToastVisible(true);
			return;
		}

		if (participants.data) {
			setParticipants(participants.data);
		}
		return;
	};

	/**
	 * Load participants on component mount
	 */
	useEffect(() => {
		getParticipants();
	}, [participantLimit, participantSearch, participantCampaignId]);

	return (
		<>
			{participants.length && dashboard ? <DashboardSection id="latest-participants" title="Latest Participants" actionLabel="View all participants" actionURL="/participants" /> : ""}
			<div id="participant-list">
				{loading && (
					<>
						<div className={`placeholder ${dashboard ? "height-5" : "height-3"}`}></div>
						<SkeletonParticipantList items={3} />
					</>
				)}
				{participants.length ? (
					<table className="data-table">
						<thead>
							<tr>
								<th>Created At</th>
								<th>Name</th>
								<th>Email address</th>
								<th>Campaign</th>
								<th></th>
							</tr>
						</thead>
						<tbody>
							{participants.map((participantItem, key) => (
								<ParticipantRow key={key} id={participantItem._id} name={participantItem.name} email={participantItem.email} campaignId={participantItem.campaignId} campaignName={participantItem.campaign.name} createdAt={participantItem.createdAt} />
							))}
						</tbody>
						<tfoot>
							<tr>
								<th>Created At</th>
								<th>Name</th>
								<th>Email address</th>
								<th>Campaign</th>
								<th></th>
							</tr>
						</tfoot>
					</table>
				) : (
					""
				)}

				{!participants.length && !loading ? <EmptyState title="No participants" description="Your campaigns haven't acquired any participants yet." helpLabel="###TODO Learn how to acquire participants" helpURL="https://" illustration="participants" /> : ""}
			</div>

			{toastVisible && <Toast onClose={() => setToastVisible(false)} duration={toastDuration} type={toastType} content={toastMessage} />}
		</>
	);
}
