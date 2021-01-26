export default function SkeletonImage({ items = 1 }) {
	let skeletons = [];
	for (let i = 0; i < items; i++) {
		skeletons.push(<div key={i} className="skeleton skeleton--editor-image"></div>);
	}
	return skeletons;
}
