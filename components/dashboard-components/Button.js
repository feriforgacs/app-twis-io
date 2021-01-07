export default function Button({ type = "", disabled = false, loading = false, size = "normal", label = "Push The Button", onClick = "" }) {
	return (
		<button className={`button button--${type} button--${size}`} disabled={loading || disabled} onClick={onClick}>
			{!loading && <span className="button__label">{label}</span>}

			{loading && (
				<span className="button__spinner">
					<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
						<path d="M7.229 1.173a9.25 9.25 0 1011.655 11.412 1.25 1.25 0 10-2.4-.698 6.75 6.75 0 11-8.506-8.329 1.25 1.25 0 10-.75-2.385z"></path>
					</svg>
				</span>
			)}
		</button>
	);
}
