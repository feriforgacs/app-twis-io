import { useContext } from "react";
import { GlobalContext } from "../../../context/GlobalState";
import SkeletonScreen from "../skeletons/SkeletonScreen";
import Screen from "./Screen";

export default function ScreenList() {
	const { screens, loading } = useContext(GlobalContext);
	return (
		<>
			{loading ? (
				<>
					<SkeletonScreen />
					<SkeletonScreen />
					<SkeletonScreen />
				</>
			) : (
				screens.map((screen) => <Screen key={screen.screenId} screen={screen} />)
			)}
		</>
	);
}
