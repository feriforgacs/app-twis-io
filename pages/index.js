import { signIn, signOut, useSession } from "next-auth/client";

export default function Home() {
	const [session, loading] = useSession();

	if (loading) {
		return <p>Loading...</p>;
	}

	return (
		<div>
			<h1>Welcome to twis ✨</h1>
			{session && session.user.email}
			<div>
				<p>
					<button onClick={() => signIn("google")}>Sign in with Google</button>
				</p>

				<p>
					<button onClick={() => signIn("facebook")}>Sign in with Facebook</button>
				</p>
			</div>
		</div>
	);
}
