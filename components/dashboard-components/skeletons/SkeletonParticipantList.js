export default function SkeletonParticipantList({ items = 1 }) {
	let skeletons = [];
	for (let i = 0; i < items; i++) {
		skeletons.push(
			<tr key={i} className="participant-list__item">
				<td className="item__created">
					<span className="skeleton skeleton--text"></span>
				</td>
				<td className={`item__name`}>
					<span className="skeleton skeleton--text"></span>
				</td>
				<td className={`item__email`}>
					<span className="skeleton skeleton--text"></span>
				</td>
				<td className="item__campaign">
					<span className="skeleton skeleton--text"></span>
				</td>
				<td></td>
			</tr>
		);
	}
	return (
		<table className="data-table">
			<thead>
				<tr>
					<th>
						<span className="skeleton"></span>
					</th>
					<th>
						<span className="skeleton"></span>
					</th>
					<th>
						<span className="skeleton"></span>
					</th>
					<th>
						<span className="skeleton"></span>
					</th>
					<th></th>
				</tr>
			</thead>
			<tbody>{skeletons}</tbody>
			<tfoot>
				<tr>
					<th>
						<span className="skeleton"></span>
					</th>
					<th>
						<span className="skeleton"></span>
					</th>
					<th>
						<span className="skeleton"></span>
					</th>
					<th>
						<span className="skeleton"></span>
					</th>
					<th></th>
				</tr>
			</tfoot>
		</table>
	);
}
