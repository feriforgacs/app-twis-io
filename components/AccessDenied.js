import LoginForm from "./LoginForm";

export default function AccessDenied() {
	return (
		<div id="access-denied">
			<p id="access-denied__message">You need to sign in to see this page.</p>
			<LoginForm signIn={true} />
		</div>
	);
}
