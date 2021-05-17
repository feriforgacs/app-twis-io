import { useRouter } from "next/router";
import { useSession, getSession } from "next-auth/client";
import Layout from "../../components/Layout";
import { GlobalProvider } from "../../context/GlobalState";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import LoginForm from "../../components/LoginForm";
import Editor from "../../components/editor-components/Editor";

export default function EditorPage() {
	const router = useRouter();
	const [session, loading] = useSession();

	if (typeof window !== "undefined" && loading) return null;

	if (!session) {
		return <LoginForm logInPage={true} accessDenied={true} />;
	}

	return (
		<Layout>
			<DndProvider backend={HTML5Backend}>
				<GlobalProvider>
					<Editor campaignId={router.query.id} />
				</GlobalProvider>
			</DndProvider>
		</Layout>
	);
}

export async function getServerSideProps(context) {
	const session = await getSession(context);
	return {
		props: { session },
	};
}
