export default function Sticker({ data, screenItemIndex }) {
	const imageStyle = {
		height: data.settings.height,
		width: data.settings.width,
		top: data.settings.top,
		left: data.settings.left,
		position: "absolute",
	};
	return <img id={`${data.type}-${data.itemId}`} className="screen-item" src={data.src} style={imageStyle} />;
}
