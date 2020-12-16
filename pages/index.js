import { useSession } from "next-auth/client";
import { useRouter } from "next/router";
import LoginForm from "../components/LoginForm";

export default function Home() {
	const router = useRouter();
	const [session] = useSession();
	/**
	 * Redirect logged in users to dashboard
	 */
	if (session) {
		router.push("/dashboard");
		return <></>;
	}

	/**
	 * Display login form to users
	 */
	return <LoginForm />;
}
