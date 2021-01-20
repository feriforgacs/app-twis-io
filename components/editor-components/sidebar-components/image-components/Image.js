import { useDrag } from "react-dnd";
import { ItemTypes } from "../../../../utils/Items";

const Image = ({ thumb, src, caption, width, height, unsplashImage = false, unsplashId = 0, unsplashUserName = "", unsplashUserProfile = "" }) => {
	const [{ isDragging }, drag] = useDrag({
		item: {
			type: ItemTypes.IMAGE,
			src,
			size: {
				width: 115,
				height: (115 / width) * height,
			},
			unsplashImage,
			unsplashId,
		},
		collect: (monitor) => ({
			isDragging: !!monitor.isDragging(),
		}),
	});

	return (
		<div className={`sidebar-image-container ${unsplashId && "sidebar-image-container--unsplash"}`}>
			<figure ref={drag} className={`${isDragging && "item--dragged"} item-draggable ${unsplashId && "image--unsplash"}`}>
				<img src={thumb} alt={caption} title="Drag & drop this image to the screen where you want to use it" />
			</figure>
			{unsplashUserName && unsplashUserProfile && (
				<div className="unsplash-image-meta">
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
