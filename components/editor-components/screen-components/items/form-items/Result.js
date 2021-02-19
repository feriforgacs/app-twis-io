import ReactMarkdown from "react-markdown";
import styles from "./Result.module.scss";

export default function Result({ status, successContent, errorContent }) {
	return (
		<div className="screen-item">
			{status === "success" && (
				<div className={`${styles.result} ${styles.resultSuccess}`}>
					<span className={styles.resultIcon}>
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
							<polyline points="20 6 9 17 4 12"></polyline>
						</svg>
					</span>
					<ReactMarkdown skipHtml={true}>{successContent}</ReactMarkdown>
				</div>
			)}
			{status === "error" && (
				<div className={`${styles.result} ${styles.resultError}`}>
					<button className={styles.errorClose}>
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
							<line x1="15" y1="9" x2="9" y2="15"></line>
							<line x1="9" y1="9" x2="15" y2="15"></line>
						</svg>
					</button>
					<p>{errorContent}</p>
				</div>
			)}
		</div>
	);
}
