import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSession, getSession } from "next-auth/client";
import { format } from "date-fns";
import NProgress from "nprogress";
import LoginForm from "../../components/LoginForm";
import Sidebar from "../../components/dashboard-components/Sidebar";
import PageHeader from "../../components/dashboard-components/PageHeader";
import Toast from "../../components/dashboard-components/Toast";

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
		return <LoginForm signInPage={true} accessDenied={true} />;
	}

	return (
		<div id="participant" className="page">
			<Head>
				<title>Participant - {process.env.APP_NAME}</title>
			</Head>
			<Sidebar />
			<div id="page__content">
				<PageHeader title="Participant" />
				{dataLoading && <p>loading...</p>}
				{participantData && (
					<>
						<div className="participant">
							<div className="participant__row">
								<div className="participant__cell">Campaign:</div>
								<div className="participant__cell">
									<Link href={`/editor/${participantData.participant.campaign._id}`}>
										<a title="View campaign in the editor">{participantData.participant.campaign.name}</a>
									</Link>
								</div>
							</div>
							<div className="participant__row">
								<div className="participant__cell">Created at:</div>
								<div className="participant__cell">{format(new Date(participantData.participant.createdAt), "yyyy.MM.dd. HH:mm:ss")}</div>
							</div>

							<div className="participant__row">
								<div className="participant__cell">Name:</div>
								<div className="participant__cell">{participantData.participant.name}</div>
							</div>

							<div className="participant__row">
								<div className="participant__cell">Email:</div>
								<div className="participant__cell">
									<a href={`mailto:${participantData.participant.email}`} target="_blank" rel="noopener noreferrer">
										{participantData.participant.email}
									</a>
								</div>
							</div>

							<div className="participant__row">
								<div className="participant__cell">Answers:</div>
								<div className="participant__cell">
									{participantAnswers.map((answer, index) => (
										<p className="answers" key={index}>
											<span className={`${answer.correct ? "correct" : "incorrect"}`}>
												{answer.correct ? (
													<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
														<polyline points="20 6 9 17 4 12"></polyline>
													</svg>
												) : (
													<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
														<line x1="18" y1="6" x2="6" y2="18"></line>
														<line x1="6" y1="6" x2="18" y2="18"></line>
													</svg>
												)}
											</span>
											<span>{answer.option}</span>
										</p>
									))}
								</div>
							</div>

							<div className="participant__row actions">
								<Link href={`/campaigns/participants/${participantData.participant.campaign._id}`}>
									<a>View all participants in this campaign</a>
								</Link>

								<Link href="/participants">
									<a>Back to all participants</a>
								</Link>
							</div>
						</div>

						<div className="participant__actions">
							<button className="button button--outline button--link">Delete participant</button>
						</div>
					</>
				)}
			</div>

			{toastVisible && <Toast onClose={() => setToastVisible(false)} duration={toastDuration} type={toastType} content={toastMessage} />}
		</div>
	);
}

export async function getServerSideProps(context) {
	const session = await getSession(context);
	return {
		props: { session },
	};
}
