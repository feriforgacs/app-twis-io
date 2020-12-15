import { useSession, getSession } from "next-auth/client";
import AccessDenied from "../components/AccessDenied";

export default function dashboard() {
	const [session, loading] = useSession();

	if (typeof window !== "undefined" && loading) return null;

	if (!session) {
		return <AccessDenied />;
	}

	return (
		<>
			<h1>Dashboard - Protected - {session.user.email}</h1>
			<p>This is the dashboard, available only to logged in users.</p>
		</>
	);
}

export async function getServerSideProps(context) {
	const session = await getSession(context);
	return {
		props: { session },
	};
}
