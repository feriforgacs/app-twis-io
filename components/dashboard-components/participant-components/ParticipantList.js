import { useEffect, useState } from "react";
import ParticipantRow from "./ParticipantRow";
import EmptyState from "../EmptyState";
import SkeletonParticipantList from "../skeletons/SkeletonParticipantList";

export default function ParticipantList({ limit = 10 }) {
	const [loading, setLoading] = useState(false);
	const [participants, setParticipants] = useState([]);

	/**
	 * TODO
	 * Get participants from the database
	 */
	useEffect(() => {});

	return (
		<div id="participant-list">
			{loading && <SkeletonParticipantList items={3} />}
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
						<ParticipantRow id="2r34354zhtgr25364" name="Ferenc Forgacs" email="forgacsf@gmail.com" campaignId="134567ujgfhgwr24535zr" campaignName="First campaign" createdAt="2021.01.04. 15:23" />
						<ParticipantRow id="wt45z46u5jutegwft" email="forgacsf@gmail.com" campaignId="134567ujgfhgwr24535zr" campaignName="First campaign" createdAt="2021.01.03. 10:11" />
						<ParticipantRow id="a4t5z6u7ikujzhtegwt" name="Ferenc Forgacs" campaignId="134567ujgfhgwr24535zr" campaignName="First campaign" createdAt="2021.01.02. 3:36" />
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
				<EmptyState title="No participants" description="Your campaigns haven't acquired any participants yet." helpLabel="Learn how to acquire participants" helpURL="https://" illustration="participants" />
			)}
		</div>
	);
}
