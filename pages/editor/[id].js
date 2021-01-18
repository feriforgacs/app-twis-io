import { useRouter } from "next/router";
import { useSession, getSession } from "next-auth/client";
import LoginForm from "../../components/LoginForm";
import Editor from "../../components/editor-components/Editor";

export default function EditorPage() {
	const router = useRouter();
	const [session, loading] = useSession();

	if (typeof window !== "undefined" && loading) return null;

	if (!session) {
		return <LoginForm signInPage={true} accessDenied={true} />;
	}

	return <Editor campaignId={router.query.id} />;
}

export async function getServerSideProps(context) {
	const session = await getSession(context);
	return {
		props: { session },
	};
}
