import { useDrag } from "react-dnd";
import styles from "./Image.module.scss";
import { ItemTypes } from "../../../../utils/Items";

const Image = ({ thumb, src, caption, width, height, unsplashImage = false, unsplashId = 0, unsplashUserName = "", unsplashUserProfile = "" }) => {
	const [{ isDragging }, drag] = useDrag({
		item: {
			type: ItemTypes.IMAGE,
			src,
			settings: {
				width: 137, // @todo change this to dynamic value, at the moment this is the width of the image in the sidebar
				height: (137 / width) * height,
			},
			unsplashImage,
			unsplashId,
		},
		collect: (monitor) => ({
			isDragging: !!monitor.isDragging(),
		}),
	});

	return (
		<div className={styles.sidebarImageContainer}>
			<figure ref={drag} className={`${isDragging && "item--dragged"}`}>
				<img src={thumb} alt={caption} title="Drag & drop this image to the screen where you want to use it" />
			</figure>
			{unsplashUserName && unsplashUserProfile && (
				<div className={`${styles.imageMeta} imageMeta`}>
					By{" "}
					<a href={unsplashUserProfile} target="_blank" rel="noopener noreferrer">
						{unsplashUserName}
					</a>{" "}
					on{" "}
					<a href="https://unsplash.com/?utm_source=twis_editor&utm_medium=referral" target="_blank" rel="noopener noreferrer">
						Unsplash
					</a>
				</div>
			)}
		</div>
	);
};

export default Image;
