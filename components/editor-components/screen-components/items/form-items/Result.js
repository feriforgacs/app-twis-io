export default function Result({ status }) {
	return (
		<>
			{status === "success" && <p>okay</p>}
			{status === "error" && <p>not okay</p>}
		</>
	);
}
