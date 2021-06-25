export default function LoginError({ error }) {
	console.log(error);

	const errors = {
		OAuthAccountNotLinked: "To access your account, please, use the email login option instead.",
	};
	return (
		<p id="login-form__error" className="alert alert--error">
			{errors[error] ? (
				errors[error]
			) : (
				<>
					Something didn&apos;t work properly. Please, try again in a few minutes or use a different login option. If you keep seeing this message, please,
					<a href="https://twis.io/contact-us" target="_blank" rel="noopener noreferrer">
						contact us
					</a>
					.
				</>
			)}
		</p>
	);
}
