import Image from "./Image";
import Sticker from "./Sticker";
import Text from "./Text";
import Button from "./Button";
import Answers from "./Answers";
import Form from "./Form";

export default function ScreenItem({ screenItem, screenId }) {
	return (
		<>
			{screenItem.type === "image" && <Image data={screenItem} screenId={screenId} />}
			{screenItem.type === "sticker" && <Sticker data={screenItem} screenId={screenId} />}
			{screenItem.type === "text" && <Text data={screenItem} screenId={screenId} />}
			{/* Using the Text component here as the only difference between texts and questions is that questions can't be removed */}
			{screenItem.type === "question" && <Text data={screenItem} screenId={screenId} />}
			{screenItem.type === "button" && <Button data={screenItem} screenId={screenId} />}
			{screenItem.type === "answers" && <Answers data={screenItem} screenId={screenId} />}
			{screenItem.type === "form" && <Form data={screenItem} screenId={screenId} />}
		</>
	);
}
