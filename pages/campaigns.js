import { useSession, getSession } from "next-auth/client";
import LoginForm from "../components/LoginForm";
import Sidebar from "../components/dashboard-components/Sidebar";

export default function campaigns() {
	const [session, loading] = useSession();

	if (typeof window !== "undefined" && loading) return null;

	if (!session) {
		return <LoginForm signInPage={true} accessDenied={true} />;
	}

	return (
		<div id="campaigns" className="page">
			<Sidebar />
		</div>
	);
}

export async function getServerSideProps(context) {
	const session = await getSession(context);
	return {
		props: { session },
	};
}
