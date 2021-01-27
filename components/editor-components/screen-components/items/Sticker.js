export default function Sticker({ data, screenItemIndex }) {
	const imageStyle = {
		height: data.settings.height,
		width: data.settings.width,
		top: data.settings.top,
		left: data.settings.left,
		position: "absolute",
	};
	return <img src={data.src} style={imageStyle} />;
}
