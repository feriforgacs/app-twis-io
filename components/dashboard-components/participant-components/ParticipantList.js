import EmptyState from "../EmptyState";

export default function ParticipantList({ limit = 10 }) {
	return <EmptyState title="No participants" description="Your campaigns haven't acquired any participants yet." helpLabel="A few ways to acquire participants" helpURL="https://" illustration="participants" />;
}
