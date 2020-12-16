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
		<div id="email-login-information">
			<h1>Check your email for login instructions</h1>
			<p>
				We’ve sent an email with a magic link to <strong>{verifyRequestEmail}</strong>. The link in the email expires shortly, so please use it soon.
			</p>
			<div id="email-login-information__providers">
				<a href="https://mail.google.com/mail/u/0/" target="_blank" rel="noopener noreferrer">
					<Image src="/images/icons/icon-gmail.svg" alt="Gmail icon" width={24} height={24} />
					Open Gmail
				</a>
				<a href="https://outlook.live.com/mail/0/inbox" target="_blank" rel="noopener noreferrer">
					<Image src="/images/icons/icon-outlook.svg" alt="Outlook icon" width={24} height={24} />
					Open Outlook
				</a>
			</div>
			<p>Can’t find your code? Make sure you check your spam folder!</p>
			<p>
				Having trouble loggin in?{" "}
				<Link href="/contact-us">
					<a>Contact Us!</a>
				</Link>
			</p>
		</div>
	);
}
