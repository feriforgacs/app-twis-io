import { useEffect, useState } from "react";
import DashboardSection from "../DashboardSection";
import ParticipantRow from "./ParticipantRow";
import EmptyState from "../EmptyState";
import EmptyStateSearch from "../EmptyStateSearch";
import SkeletonParticipantList from "../skeletons/SkeletonParticipantList";
import SkeletonSearchForm from "../skeletons/SkeletonSearchForm";
import Toast from "../Toast";
import ParticipantSearch from "./ParticipantSearch";
import FooterHelp from "../FooterHelp";
import LinkComponent from "../LinkComponent";

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
	const [searching, setSearching] = useState(false);
	const [filtered, setFiltered] = useState(false);

	/**
	 * Get participants from the database
	 */
	const getParticipants = async (reset = false) => {
		const participantsRequest = await fetch(`${process.env.APP_URL}/api/participants?limit=${participantLimit}&search=${reset ? "" : participantSearch}&campaign=${reset ? "" : participantCampaignId}`, {
			method: "GET",
		});

		const participants = await participantsRequest.json();

		setLoading(false);
		setSearching(false);

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
	}, []);

	/**
	 * Remove participant from state
	 * @param {int} index participants index in the array
	 */
	const removeParticipant = (index) => {
		const remainingParticipants = [...participants];
		remainingParticipants.splice(index, 1);
		setParticipants(remainingParticipants);
	};

	/**
	 * Filter campaign list
	 */
	const filterParticipants = () => {
		setLoading(true);
		setSearching(true);
		setFiltered(true);
		getParticipants();
	};

	const filterReset = () => {
		setParticipantSearch("");
		if (filtered) {
			setLoading(true);
			setFiltered(false);
			getParticipants(true);
		}
	};

	return (
		<>
			{participants.length && dashboard ? <DashboardSection id="latest-participants" title="Latest Participants" actionLabel="View all participants" actionURL="/participants" /> : ""}

			{loading && !dashboard && (
				<>
					<div className={`placeholder height-2`}></div>
					<SkeletonSearchForm items={2} />
				</>
			)}

			{(participants.length || filtered) && !dashboard ? <ParticipantSearch participantSearch={participantSearch} setParticipantSearch={setParticipantSearch} setParticipantCampaignId={setParticipantCampaignId} loading={loading} setLoading={setLoading} filterParticipants={filterParticipants} filterReset={filterReset} /> : ""}

			<div id="participant-list">
				{/* Display loading state when getting participants on pageload or search */}
				{loading && (
					<>
						<div className={`placeholder ${dashboard ? "height-5" : ""}`}></div>
						<p className="skeleton skeleton-p--short"></p>
						<SkeletonParticipantList items={3} />
					</>
				)}

				{/* Display participants when not not empty and not searching */}
				{participants.length && !searching ? (
					<>
						<p className="item-count text--small text--secondary mt-0 mb-10 pl-20">
							<strong>{participants.length}</strong> participant{participants.length > 1 ? "s" : ""}
						</p>
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
									<ParticipantRow key={key} index={key} id={participantItem._id} name={participantItem.name} email={participantItem.email} campaignId={participantItem.campaignId} campaignName={participantItem.campaign.name} createdAt={participantItem.createdAt} setToastMessage={setToastMessage} setToastVisible={setToastVisible} setToastType={setToastType} setToastDuration={setToastDuration} removeParticipant={removeParticipant} />
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
					</>
				) : (
					""
				)}

				{/* Display no result state when there are no search results */}
				{filtered && !participants.length && !searching ? <EmptyStateSearch title="No result" description="We couldn't find any items that fit your criteria. Please, try a different keyword" illustration="participants" /> : ""}

				{/* Empty state when there are no participants, not search result and not loading */}
				{!participants.length && !loading && !filtered ? <EmptyState title="No participants" description="Your campaigns haven't acquired any participants yet." helpLabel="###TODO Learn how to acquire participants" helpURL="https://" illustration="participants" /> : ""}
			</div>

			{!dashboard && (
				<FooterHelp>
					Learn more about <LinkComponent url="http://twis.io">getting participants</LinkComponent>
				</FooterHelp>
			)}

			{toastVisible && <Toast onClose={() => setToastVisible(false)} duration={toastDuration} type={toastType} content={toastMessage} />}
		</>
	);
}
