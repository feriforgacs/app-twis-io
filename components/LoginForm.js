import { signIn, useSession } from "next-auth/client";
import { useRouter } from "next/router";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function LoginForm({ loginError = false, loggedOut = false, signInPage = false, accessDenied = false }) {
	const router = useRouter();
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

	const submitButtonLabel = signInPage || loggedOut ? `Sign in with email` : `Continue with email`;

	return (
		<>
			{accessDenied && (
				<div id="access-denied">
					<p id="access-denied__message">You need to sign in to see this page.</p>
				</div>
			)}
			<main id="login-form">
				<header>
					<div className="logo-container">
						<Image src="/images/logo.svg" alt={`${process.env.APP_NAME} logo`} className="logo" width={80} height={28} />
					</div>
					<h1>{signInPage ? `Sign in` : `Sign up or log in`}</h1>
					{loginError && (
						<p id="login-form__error" className="alert alert--error">
							Something didn&apos;t work properly. Please, try again in a few minutes or use a different login option. If you keep seeing this message, please,{" "}
							<Link href="/contact-us">
								<a>contact us</a>
							</Link>
							.
						</p>
					)}

					{loggedOut && (
						<p id="login-form__success" className="alert alert--success">
							You logged out successfully. Hope to see you soon{" "}
							<span role="img" aria-label="waving hand emoji">
								👋
							</span>
						</p>
					)}
				</header>

				<section>
					<div id="login-form__social">
						<button className="button button--outline" onClick={() => signIn("google", { callbackUrl: "/dashboard" })}>
							<Image src="/images/icons/icon-google.svg" alt="Google logo" width={24} height={24} />
							<span>{signInPage || loggedOut ? `Sign in` : `Continue`} with Google</span>
						</button>

						<button className="button button--outline" onClick={() => signIn("facebook", { callbackUrl: "/dashboard" })}>
							<Image src="/images/icons/icon-facebook.svg" alt="Facebook logo" width={24} height={24} />
							<span>{signInPage || loggedOut ? `Sign in` : `Continue`} with Facebook</span>
						</button>
					</div>
					<div id="login-form__separator">
						<hr />
						<span>or</span>
						<hr />
					</div>
					<div id="login-form__email">
						<form
							method="post"
							onSubmit={(e) => {
								signInWithEmail(e);
							}}
						>
							<input type="email" value={loginEmailAddress} disabled={emailLoginLoading} onChange={(e) => handleEmailUpdate(e.target.value)} placeholder="Your email address" required="required" />
							<button type="submit" disabled={emailLoginLoading || !isValidEmail} className="button button--primary">
								{emailLoginLoading ? "Sending email..." : submitButtonLabel}
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

					<div id="login-form__help">
						<p>
							Having trouble signing in?{" "}
							<Link href="/contact-us">
								<a>Let us help!</a>
							</Link>
						</p>
					</div>
				</section>
			</main>
		</>
	);
}
