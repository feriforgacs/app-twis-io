export default function Pagination({ pageCount, currentPage, goToPage }) {
	let paginationItems = [];

	for (let i = 1; i <= pageCount; i++) {
		paginationItems.push(
			i === currentPage ? (
				<span key={i} className="pagination__item pagination__item--active" onClick={() => goToPage(i)}>
					{i}
				</span>
			) : (
				<span key={i} className="pagination__item pagination__item" onClick={() => goToPage(i)}>
					{i}
				</span>
			)
		);
	}

	return (
		<div className="pagination">
			<div className="pagination__items">{paginationItems}</div>
		</div>
	);
}
