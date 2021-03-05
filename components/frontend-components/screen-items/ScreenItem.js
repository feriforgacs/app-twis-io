import Image from "./Image";
import Sticker from "./Sticker";
import Text from "./Text";
import Button from "./Button";
import Answers from "./Answers";
import Form from "./Form";

export default function ScreenItem({ item }) {
	return (
		<>
			{item.type === "image" && <Image data={item} />}
			{item.type === "sticker" && <Sticker data={item} />}
			{item.type === "text" && <Text data={item} />}
			{item.type === "question" && <Text data={item} />}
			{item.type === "button" && <Button data={item} />}
			{item.type === "answers" && <Answers data={item} />}
			{item.type === "form" && <Form data={item} />}
		</>
	);
}
