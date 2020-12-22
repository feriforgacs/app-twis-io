import React, { useEffect } from "react";

export default function Toast({ type = "", content = "Toast content", onClose = null, duration = 4000 }) {
	useEffect(() => {
		const toastInterval = setInterval(() => {
			onClose();
		}, duration);

		return () => clearInterval(toastInterval);
	});

	return (
		<div className="toast__container">
			<div className={`toast toast--${type}`}>
				<span>{content}</span>
				<button className="button button--close" onClick={onClose}>
					<svg viewBox="0 0 20 20">
						<path d="M11.414 10l6.293-6.293a.999.999 0 1 0-1.414-1.414L10 8.586 3.707 2.293a.999.999 0 1 0-1.414 1.414L8.586 10l-6.293 6.293a.999.999 0 1 0 1.414 1.414L10 11.414l6.293 6.293a.997.997 0 0 0 1.414 0 .999.999 0 0 0 0-1.414L11.414 10z"></path>
					</svg>
				</button>
			</div>
		</div>
	);
}
