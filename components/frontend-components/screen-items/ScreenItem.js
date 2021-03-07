import Image from "./Image";
import Sticker from "./Sticker";
import Text from "./Text";
import Button from "./Button";
import Answers from "./Answers";
import Form from "./Form";

export default function ScreenItem({ item, lastScreenIndex }) {
	return (
		<>
			{item.type === "image" && <Image data={item} lastScreenIndex={lastScreenIndex} />}
			{item.type === "sticker" && <Sticker data={item} lastScreenIndex={lastScreenIndex} />}
			{item.type === "text" && <Text data={item} lastScreenIndex={lastScreenIndex} />}
			{item.type === "question" && <Text data={item} lastScreenIndex={lastScreenIndex} />}
			{item.type === "button" && <Button data={item} lastScreenIndex={lastScreenIndex} />}
			{item.type === "answers" && <Answers data={item} lastScreenIndex={lastScreenIndex} />}
			{item.type === "form" && <Form data={item} lastScreenIndex={lastScreenIndex} />}
		</>
	);
}
