import Favicons from "./Favicons";

export default function Layout({ children }) {
	return (
		<>
			<Favicons />
			{children}
		</>
	);
}
