import { useContext } from "react";
import { GlobalContext } from "../../../context/GlobalState";
import Screen from "./Screen";

export default function ScreenList() {
	const { screens } = useContext(GlobalContext);
	return (
		<>
			{screens.map((screen) => (
				<Screen key={screen._id} />
			))}
		</>
	);
}
