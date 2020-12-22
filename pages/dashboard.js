import { useSession, getSession } from "next-auth/client";
import LoginForm from "../components/LoginForm";
import Sidebar from "../components/dashboard-components/Sidebar";
import Toast from "../components/dashboard-components/Toast";
import { useState } from "react";

export default function dashboard() {
	const [session, loading] = useSession();
	const [toastVisible, setToastVisible] = useState(true);

	if (typeof window !== "undefined" && loading) return null;

	if (!session) {
		return <LoginForm signInPage={true} accessDenied={true} />;
	}

	return (
		<div id="dashboard" className="page">
			<Sidebar />
			<div id="page__content">
				<h1>Dashboard</h1>

				{toastVisible && <Toast onClose={() => setToastVisible(false)} duration={3000} content={`Test toast...`} />}
			</div>
		</div>
	);
}

export async function getServerSideProps(context) {
	const session = await getSession(context);
	return {
		props: { session },
	};
}
