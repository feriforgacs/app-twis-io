import { useState, useEffect } from "react";

export default function CheckYourInbox() {
	const [verifyRequestEmail, setVerifyRequestEmail] = useState();

	useEffect(() => {
		if (localStorage.getItem("verifyRequestEmail")) {
			setVerifyRequestEmail(localStorage.getItem("verifyRequestEmail"));
		}
	});

	return (
		<div>
			<h1>We've just sent an email to {verifyRequestEmail}</h1>
		</div>
	);
}
