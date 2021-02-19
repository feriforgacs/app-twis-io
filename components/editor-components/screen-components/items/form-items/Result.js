import ReactMarkdown from "react-markdown";
import styles from "./Result.module.scss";

export default function Result({ status, successContent, errorContent }) {
	return (
		<div className="screen-item">
			{status === "success" && (
				<div className={`${styles.result} ${styles.resultSuccess}`}>
					<span>
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
							<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
							<polyline points="22 4 12 14.01 9 11.01"></polyline>
						</svg>
					</span>
					<span>
						<ReactMarkdown>{successContent}</ReactMarkdown>
					</span>
				</div>
			)}
			{status === "error" && <div className={`${styles.result} ${styles.resultError}`}>{errorContent}</div>}
		</div>
	);
}
