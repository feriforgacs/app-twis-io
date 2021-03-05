export default function Image({ data }) {
	const imageStyle = {
		height: `${data.settings.height || 0}px`,
		width: `${data.settings.width || 0}px`,
		top: `${data.settings.top || 0}px`,
		left: `${data.settings.left || 0}px`,
		transform: `translateX(${data.settings.translateX || 0}px) translateY(${data.settings.translateY || 0}px) rotate(${data.settings.rotate || 0}deg)`,
		opacity: typeof data.settings.opacity !== undefined ? data.settings.opacity : 1,
		zIndex: data.orderIndex,
		position: "absolute",
	};

	return (
		<>
			<img src={data.src} style={imageStyle} />
		</>
	);
}
