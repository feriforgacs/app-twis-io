import Image from "./Image";
import Sticker from "./Sticker";
import Text from "./Text";

export default function ScreenItem({ screenItem, screenItemIndex }) {
	return (
		<>
			{screenItem.type === "image" && <Image data={screenItem} screenItemIndex={screenItemIndex} />}
			{screenItem.type === "sticker" && <Sticker data={screenItem} screenItemIndex={screenItemIndex} />}
			{screenItem.type === "text" && <Text data={screenItem} screenItemIndex={screenItemIndex} />}
		</>
	);
}
