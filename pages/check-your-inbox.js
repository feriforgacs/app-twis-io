import { useSession } from "next-auth/client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function CheckYourInbox() {
	const [session] = useSession();
	const [verifyRequestEmail, setVerifyRequestEmail] = useState();

	useEffect(() => {
		if (localStorage.getItem("verifyRequestEmail")) {
			setVerifyRequestEmail(localStorage.getItem("verifyRequestEmail"));
		}
	});

	/**
	 * Redirect logged in users to dashboard
	 */
	if (session) {
		router.push("/dashboard");
		return <></>;
	}

	return (
		<main id="email-signup-confirm">
			<header>
				<div className="logo-container">
					<Image src="/images/logo.svg" alt="TWiS logo" className="logo" width={80} height={28} />
				</div>
				<h1>Check your email for login instructions</h1>
			</header>
			<section>
				<p>
					We’ve sent an email with a <span rel="image">✨</span> magic link <span rel="image">✨</span> to <strong>{verifyRequestEmail}</strong>. The link in the email expires shortly, so please use it soon.
				</p>
				<div id="email-signup-confirm__providers">
					<a href="https://mail.google.com/mail/u/0/" target="_blank" rel="noopener noreferrer">
						<Image src="/images/icons/icon-gmail.svg" alt="Gmail icon" width={24} height={24} />
						<span>Open Gmail</span>
					</a>
					<a href="https://outlook.live.com/mail/0/inbox" target="_blank" rel="noopener noreferrer">
						<Image src="/images/icons/icon-outlook.svg" alt="Outlook icon" width={24} height={24} />
						<span>Open Outlook</span>
					</a>
				</div>

				<div id="email-signup-confirm__help">
					<p>Can’t find the email? Make sure you check your spam folder!</p>
					<p>
						Having trouble signing in? <Link href="/contact-us">Let us help!</Link>
					</p>
				</div>
			</section>
		</main>
	);
}
