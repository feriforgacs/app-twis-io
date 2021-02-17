import Image from "./Image";
import Sticker from "./Sticker";
import Text from "./Text";
import Button from "./Button";
import Answers from "./Answers";
import Form from "./Form";

export default function ScreenItem({ screenItem }) {
	return (
		<>
			{screenItem.type === "image" && <Image data={screenItem} />}
			{screenItem.type === "sticker" && <Sticker data={screenItem} />}
			{screenItem.type === "text" && <Text data={screenItem} />}
			{/* Using the Text component here as the only difference between texts and questions is that questions can't be removed */}
			{screenItem.type === "question" && <Text data={screenItem} />}
			{screenItem.type === "button" && <Button data={screenItem} />}
			{screenItem.type === "answers" && <Answers data={screenItem} />}
			{screenItem.type === "form" && <Form data={screenItem} />}
		</>
	);
}
