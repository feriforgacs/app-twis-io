import { useDrag } from "react-dnd";
import { ItemTypes } from "../../../../utils/Items";
import styles from "../image-components/Image.module.scss";

const Sticker = ({ thumb, src, caption, width, height }) => {
	const [{ isDragging }, drag] = useDrag({
		type: ItemTypes.STICKER,
		item: {
			src,
			settings: {
				width: 137, // @todo change this to dynamic value, at the moment this is the width of the image in the sidebar
				height: (137 / width) * height,
			},
		},
		collect: (monitor) => ({
			isDragging: !!monitor.isDragging(),
		}),
	});

	return (
		<div className={styles.sidebarImageContainer}>
			<figure ref={drag} className={`${isDragging && "item--dragged"} item-draggable`}>
				<img src={thumb} alt={caption} title="Drag & drop this sticker to the screen where you want to use it" />
			</figure>
		</div>
	);
};

export default Sticker;
