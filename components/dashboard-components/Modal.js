import Button from "./Button";

export default function Modal({ title = "Modal title", body = "Modal body", primaryActionLabel = "", primaryAction = null, secondaryActionLabel = "", secondaryAction = null, onClose = null, loading = false }) {
	return (
		<div className="modal__container">
			<div className="modal">
				<button className="button button--close" onClick={onClose}>
					<svg viewBox="0 0 20 20">
						<path d="M11.414 10l6.293-6.293a.999.999 0 1 0-1.414-1.414L10 8.586 3.707 2.293a.999.999 0 1 0-1.414 1.414L8.586 10l-6.293 6.293a.999.999 0 1 0 1.414 1.414L10 11.414l6.293 6.293a.997.997 0 0 0 1.414 0 .999.999 0 0 0 0-1.414L11.414 10z"></path>
					</svg>
				</button>
				<div className="modal__header">
					<h3>{title}</h3>
				</div>
				<div className="modal__body">
					<p>{body}</p>
				</div>
				<div className="modal__footer">
					{secondaryActionLabel && (
						<button className="button button--default" onClick={secondaryAction} disabled={loading}>
							{secondaryActionLabel}
						</button>
					)}

					{primaryActionLabel && <Button type="danger" label={primaryActionLabel} onClick={primaryAction} loading={loading} disabled={loading} />}
				</div>
			</div>
		</div>
	);
}
