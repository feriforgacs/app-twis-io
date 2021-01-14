import { useSession } from "next-auth/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import LoginForm from "../components/LoginForm";

export default function Home() {
	const router = useRouter();
	const [session] = useSession();
	const [loginError, setLoginError] = useState(false);
	const [loggedOut, setLoggedOut] = useState(false);

	useEffect(() => {
		if (router.query.error) {
			setLoginError(true);
		}
		if (router.query.logout) {
			setLoggedOut(true);
		}
	}, [router.query.error, router.query.logout]);

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
	return <LoginForm loginError={loginError} loggedOut={loggedOut} />;
}
