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
import Pagination from "../Pagination";
import NProgress from "nprogress";

export default function ParticipantList({ limit = 200, dashboard = false, campaignId = "", hideCampaignSelect = false }) {
	const [loading, setLoading] = useState(true);
	const [participants, setParticipants] = useState([]);
	const [participantLimit] = useState(limit);
	const [participantSearch, setParticipantSearch] = useState("");
	const [participantCampaignId, setParticipantCampaignId] = useState(campaignId);
	const [toastMessage, setToastMessage] = useState(false);
	const [toastVisible, setToastVisible] = useState(false);
	const [toastType, setToastType] = useState("default");
	const [toastDuration, setToastDuration] = useState(3000);
	const [searching, setSearching] = useState(false);
	const [filtered, setFiltered] = useState(false);
	const [page, setPage] = useState(1);
	const [pageCount, setPageCount] = useState(1);

	/**
	 * Get participants from the database
	 */
	const getParticipants = async (reset = false, page = 1) => {
		const participantsRequest = await fetch(`${process.env.APP_URL}/api/participants?limit=${participantLimit}&search=${reset ? "" : participantSearch}&campaign=${participantCampaignId}&page=${page}`, {
			method: "GET",
		});

		const participants = await participantsRequest.json();

		setLoading(false);
		setSearching(false);
		NProgress.done();

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
			setPage(page);
		}
		return;
	};

	/**
	 * Count all participants, or participants by campaign
	 * @param {bool} reset reset campaign id
	 */
	const countParticipants = async (reset = false) => {
		const participantsCountRequest = await fetch(`${process.env.APP_URL}/api/participants/count?campaign=${reset ? "" : participantCampaignId}&search=${reset ? "" : participantSearch}`, {
			method: "GET",
		});

		const participantsCount = await participantsCountRequest.json();

		if (participantsCount.success !== true) {
			// error
			setToastMessage("Can't count participants. Please, try again.");
			setToastType("error");
			setToastDuration(6000);
			setToastVisible(true);
			return;
		}

		if (participantsCount.data) {
			if (participantsCount.data > participantLimit) {
				// count pages if participant count is higher than the limit
				setPageCount(Math.ceil(participantsCount.data / participantLimit));
			} else {
				setPageCount(1);
			}
		}
		return;
	};

	/**
	 * Load participants on component mount
	 * Count participants on component load
	 */
	useEffect(() => {
		//getParticipants();
		//countParticipants();
	});

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
	 * Filter participant list
	 */
	const filterParticipants = () => {
		setLoading(true);
		setSearching(true);
		setFiltered(true);
		getParticipants();
		countParticipants();
	};

	/**
	 * Reset participant search
	 */
	const filterReset = () => {
		setParticipantSearch("");
		if (filtered) {
			setSearching(true);
			setLoading(true);
			setFiltered(false);
			getParticipants(true);
			countParticipants(true);
		}
	};

	/**
	 * Go to selected page
	 */
	const goToPage = (pageIndex) => {
		NProgress.start();
		getParticipants(false, pageIndex);
	};

	return (
		<>
			{participants.length && dashboard ? <DashboardSection id="latest-participants" title="Latest Participants" actionLabel="View all participants" actionURL="/participants" /> : ""}

			{loading && !dashboard && !searching && (
				<>
					<div className={`placeholder height-2`}></div>
					<SkeletonSearchForm items={2} />
				</>
			)}

			{(participants.length || filtered) && !dashboard ? <ParticipantSearch participantSearch={participantSearch} setParticipantSearch={setParticipantSearch} setParticipantCampaignId={setParticipantCampaignId} participantCampaignId={participantCampaignId} loading={loading} setLoading={setLoading} filterParticipants={filterParticipants} filterReset={filterReset} hideCampaignSelect={hideCampaignSelect} /> : ""}

			<div id="participant-list">
				{/* Display loading state when getting participants on pageload or search */}
				{loading && (
					<>
						<div className={`placeholder ${dashboard ? "height-5" : ""}`}></div>
						<SkeletonParticipantList items={3} />
					</>
				)}

				{/* Display participants when not not empty and not searching */}
				{participants.length && !searching ? (
					<>
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

						{pageCount > 1 && !dashboard && <Pagination pageCount={pageCount} currentPage={page} goToPage={goToPage} />}
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
