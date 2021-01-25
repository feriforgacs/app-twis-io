import { useRouter } from "next/router";
import { useSession, getSession } from "next-auth/client";
import { GlobalProvider } from "../../context/GlobalState";
import LoginForm from "../../components/LoginForm";
import Editor from "../../components/editor-components/Editor";

export default function EditorPage() {
	const router = useRouter();
	const [session, loading] = useSession();

	if (typeof window !== "undefined" && loading) return null;

	if (!session) {
		return <LoginForm signInPage={true} accessDenied={true} />;
	}

	return (
		<GlobalProvider>
			<Editor campaignId={router.query.id} />
		</GlobalProvider>
	);
}

export async function getServerSideProps(context) {
	const session = await getSession(context);
	return {
		props: { session },
	};
}
