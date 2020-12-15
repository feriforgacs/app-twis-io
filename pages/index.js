import { signIn, signOut, useSession } from "next-auth/client";
import { useState } from "react";
import { useRouter } from "next/router";

export default function Home() {
	const router = useRouter();

	const [session, loading] = useSession();
	const [loginEmailAddress, setLoginEmailAddress] = useState("");
	const [loginLoading, setLoginLoading] = useState(false);

	/**
	 * Handle login with email address
	 * @param {object} e Form submit event object
	 */
	const signInWithEmail = (e) => {
		e.preventDefault();
		setLoginLoading(true);
		signIn("email", { email: loginEmailAddress });
	};

	/**
	 * Loading state
	 */
	if (loading) {
		return <p>Loading...</p>;
	}

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
	return (
		<div>
			<h1>Welcome to twis ✨</h1>
			{session && session.user.email}
			<div>
				<form
					method="post"
					onSubmit={(e) => {
						signInWithEmail(e);
					}}
				>
					<input type="email" value={loginEmailAddress} onChange={(e) => setLoginEmailAddress(e.target.value)} placeholder="Your email address" required="required" />
					<button type="submit" disabled={loginLoading}>
						Log in with email
					</button>
					{loginLoading && <span>processing...</span>}
				</form>
				<p>
					<button onClick={() => signIn("google", { callbackUrl: "/dashboard" })}>Sign in with Google</button>
				</p>

				<p>
					<button onClick={() => signIn("facebook", { callbackUrl: "/dashboard" })}>Sign in with Facebook</button>
				</p>
			</div>
		</div>
	);
}
