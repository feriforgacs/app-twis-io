import { signIn, useSession } from "next-auth/client";
import { useState } from "react";
import Image from "next/image";

export default function LoginForm() {
	const [session, loading] = useSession();
	const [loginEmailAddress, setLoginEmailAddress] = useState("");
	const [emailLoginLoading, setEmailLoginLoading] = useState(false);
	const [isValidEmail, setIsValidEmail] = useState(false);

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
	 * Handle login with email address
	 * @param {object} e Form submit event object
	 */
	const signInWithEmail = (e) => {
		e.preventDefault();
		setEmailLoginLoading(true);
		localStorage.setItem("verifyRequestEmail", loginEmailAddress);
		signIn("email", { email: loginEmailAddress });
	};

	/**
	 * Handle email input field changes
	 * @param {string} email Email address string
	 */
	const handleEmailUpdate = (email) => {
		setLoginEmailAddress(email);
		// check email format
		setIsValidEmail(/\S+@\S+\.\S+/.test(email));
	};

	return (
		<div id="login-form">
			<header>
				<span>TWiS ✨</span>
				<h1>Sign up or log in</h1>
			</header>

			<section>
				<div id="login-form__social">
					<button onClick={() => signIn("google", { callbackUrl: "/dashboard" })}>
						<Image src="/images/icons/icon-google.svg" alt="Google logo" width={24} height={24} />
						Continue with Google
					</button>

					<button onClick={() => signIn("facebook", { callbackUrl: "/dashboard" })}>
						<Image src="/images/icons/icon-facebook.svg" alt="Facebook logo" width={24} height={24} />
						Continue with Facebook
					</button>
				</div>
				<p id="login-form__separator">or</p>
				<div id="login-form__email">
					<form
						method="post"
						onSubmit={(e) => {
							signInWithEmail(e);
						}}
					>
						<input type="email" value={loginEmailAddress} onChange={(e) => handleEmailUpdate(e.target.value)} placeholder="Your email address" required="required" />
						<button type="submit" disabled={emailLoginLoading || !isValidEmail}>
							{emailLoginLoading ? "Sending email..." : `Continue with email`}
						</button>
					</form>
				</div>

				<div id="login-form__legal">
					By continuing with Google, Facebook, or email, you agree to our{" "}
					<a href="/terms-of-service" target="_blank" rel="noopener noreferrer">
						Terms of Service
					</a>{" "}
					and{" "}
					<a href="/privacy-policy" target="_blank" rel="noopener noreferrer">
						Privacy Policy
					</a>
					.
				</div>
			</section>
		</div>
	);
}
