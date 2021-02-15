import Image from "./Image";
import Sticker from "./Sticker";
import Text from "./Text";
import Button from "./Button";

export default function ScreenItem({ screenItem }) {
	return (
		<>
			{screenItem.type === "image" && <Image data={screenItem} />}
			{screenItem.type === "sticker" && <Sticker data={screenItem} />}
			{screenItem.type === "text" && <Text data={screenItem} />}
			{screenItem.type === "button" && <Button data={screenItem} />}
		</>
	);
}
