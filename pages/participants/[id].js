import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSession, getSession } from "next-auth/client";
import NProgress from "nprogress";
import Layout from "../../components/Layout";
import LoginForm from "../../components/LoginForm";
import Sidebar from "../../components/dashboard-components/Sidebar";
import PageHeader from "../../components/dashboard-components/PageHeader";
import Toast from "../../components/dashboard-components/Toast";
import ParticipantDetails from "../../components/dashboard-components/participant-components/ParticipantDetails";
import SkeletonParticipantDetails from "../../components/dashboard-components/skeletons/SkeletonParticipantDetails";

export default function ParticipantPage() {
	const [session, loading] = useSession();
	const [dataLoading, setDataLoading] = useState(true);
	const [toastMessage, setToastMessage] = useState(false);
	const [toastVisible, setToastVisible] = useState(false);
	const [toastType, setToastType] = useState("default");
	const [toastDuration, setToastDuration] = useState(3000);
	const [participantData, setParticipantData] = useState();
	const [participantAnswers, setParticipantAnswers] = useState([]);

	const router = useRouter();
	const participantId = router.query.id;

	useEffect(() => {
		/**
		 * Get participant data from the database on component load
		 */
		const getParticipantData = async () => {
			NProgress.start();
			try {
				const participantRequest = await fetch(`/api/participants/data?id=${participantId}`, {
					method: "GET",
				});

				const participant = await participantRequest.json();

				setDataLoading(false);
				NProgress.done();

				if (participant.success !== true) {
					// error
					setToastMessage("Can't get participant data. Please, try again.");
					setToastType("error");
					setToastDuration(6000);
					setToastVisible(true);
					return;
				}

				if (participant.data) {
					setParticipantData(participant.data);
					let answers = [];
					for (const answerKey in participant.data.answers) {
						answers.push(participant.data.answers[answerKey]);
					}
					setParticipantAnswers(answers);
				}
			} catch (error) {
				console.log(error);
				setDataLoading(false);
				NProgress.done();
				setToastMessage("Can't get participant data. Please, try again.");
				setToastType("error");
				setToastDuration(6000);
				setToastVisible(true);
			}

			return;
		};

		getParticipantData();
	}, [participantId]);

	if (typeof window !== "undefined" && loading) return null;

	if (!session) {
		return <LoginForm logInPage={true} accessDenied={true} />;
	}

	return (
		<Layout>
			<div id="participant" className="page">
				<Head>
					<title>Participant - {process.env.APP_NAME}</title>
				</Head>
				<Sidebar />
				<div id="page__content">
					<PageHeader title="Participant" secondaryActionLabel="Back to all participants" secondaryActionURL="/participants" />
					{dataLoading && <SkeletonParticipantDetails />}
					{participantData && <ParticipantDetails participantData={participantData} participantAnswers={participantAnswers} setToastMessage={setToastMessage} setToastType={setToastType} setToastDuration={setToastDuration} setToastVisible={setToastVisible} />}
				</div>

				{toastVisible && <Toast onClose={() => setToastVisible(false)} duration={toastDuration} type={toastType} content={toastMessage} />}
			</div>
		</Layout>
	);
}

export async function getServerSideProps(context) {
	const session = await getSession(context);
	return {
		props: { session },
	};
}
