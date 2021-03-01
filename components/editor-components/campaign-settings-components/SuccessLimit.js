import { useContext, useState, useEffect } from "react";
import { GlobalContext } from "../../../context/GlobalState";
import { DebounceInput } from "react-debounce-input";
import styles from "../CampaignSettings.module.scss";

export default function SuccessLimit() {
	const { campaign, updateCampaignData, screens } = useContext(GlobalContext);

	const [successLimit, setSuccessLimit] = useState(campaign.successLimit || 0);
	const [questionScreens, setQuestionScreen] = useState(0);

	useEffect(() => {
		const questionScreens = screens.filter((screen) => screen.type === "question");
		setQuestionScreen(questionScreens.length);
	}, [screens]);

	return (
		<div className={styles.settingsPanelSection}>
			<label className={styles.settingsPanelLabel}>Correct Answer Limit</label>
			<DebounceInput
				className={styles.settingsPanelInput}
				type="number"
				min={0}
				max={questionScreens}
				debounceTimeout="1000"
				value={successLimit || 0}
				onChange={(e) => {
					const limit = parseInt(e.target.value);
					updateCampaignData("successLimit", limit);
					setSuccessLimit(limit);
				}}
			/>
			<p className={styles.settingsPanelHelp}>
				The number of questions your players have to answer properly to successfully complete the quiz. <strong>(min 0, max {questionScreens})</strong>
				<br />
				eg.: 0 - users can successfully complete the quiz without any correct answers, eg.: 5 - at least 5 correct answers is needed to successfully complete the quiz
			</p>
		</div>
	);
}
