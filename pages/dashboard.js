import { useSession, signOut, getSession } from "next-auth/client";
import LoginForm from "../components/LoginForm";

export default function dashboard() {
	const [session, loading] = useSession();

	if (typeof window !== "undefined" && loading) return null;

	if (!session) {
		return <LoginForm signIn={true} accessDenied={true} />;
	}

	return (
		<>
			<h1>Dashboard - Protected - {session.user.email}</h1>
			<p>This is the dashboard, available only to logged in users.</p>
			<button onClick={() => signOut({ callbackUrl: `${process.env.APP_URL}/signed-out` })}>Sign out</button>
		</>
	);
}

export async function getServerSideProps(context) {
	const session = await getSession(context);
	return {
		props: { session },
	};
}
