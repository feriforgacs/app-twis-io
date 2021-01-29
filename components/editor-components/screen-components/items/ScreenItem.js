import Image from "./Image";
import Sticker from "./Sticker";
import Text from "./Text";

export default function ScreenItem({ screenItem }) {
	return (
		<>
			{screenItem.type === "image" && <Image data={screenItem} />}
			{screenItem.type === "sticker" && <Sticker data={screenItem} />}
			{screenItem.type === "text" && <Text data={screenItem} />}
		</>
	);
}
