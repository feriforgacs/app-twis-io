import Cors from "cors";
import initMiddleware from "../../../../lib/InitMiddleware";
import AuthCheck from "../../../../lib/AuthCheck";
import { createApi } from "unsplash-js";

const cors = initMiddleware(
	Cors({
		methods: ["GET"],
	})
);

export default async function StockListHandler(req, res) {
	await cors(req, res);

	const authStatus = await AuthCheck(req, res);
	if (!authStatus) {
		res.end();
		return;
	}

	const keyword = req.query.keyword || "";
	const page = req.query.page || 1;

	const unsplash = new createApi({
		accessKey: process.env.UNSPLASH_ACCESS_KEY,
	});

	let unsplashResult = null;
	let unsplashResultPhotos = [];

	if (page >= 1 && keyword !== "") {
		// load more images
		try {
			unsplashResult = await unsplash.search.getPhotos({ query: keyword, page: page + 1 });
			if (unsplashResult.type !== "success") {
				return res.status(unsplashResult.status).json({ success: false });
			}

			if (unsplashResult.response.results && unsplashResult.response.results.length > 0) {
				unsplashResultPhotos = unsplashResult.response.results;
			}
		} catch (error) {
			console.log(error);
			return res.status(400).json({ success: false, error });
		}
	} else if (keyword && keyword !== "") {
		// search images
		try {
			unsplashResult = await unsplash.search.getPhotos({ query: keyword });
			if (unsplashResult.type !== "success") {
				return res.status(unsplashResult.status).json({ success: false });
			}

			if (unsplashResult.response.total && unsplashResult.response.total > 0) {
				unsplashResultPhotos = unsplashResult.response.results;
			}
		} catch (error) {
			console.log(error);
			return res.status(400).json({ success: false, error });
		}
	} else {
		// default - show latest images
		try {
			unsplashResult = await unsplash.photos.list({ page });
			if (unsplashResult.type !== "success") {
				return res.status(unsplashResult.status).json({ success: false });
			}
			unsplashResultPhotos = unsplashResult.response.results;
		} catch (error) {
			console.log(error);
			return res.status(400).json({ success: false, error });
		}
	}

	let unsplashPhotos = [];

	if (unsplashResultPhotos.length > 0) {
		unsplashResultPhotos.forEach((photo) => {
			const photoItem = {
				id: photo.id,
				thumb: photo.urls.thumb,
				thumb_width: 115,
				thumb_height: Math.floor((200 / photo.width) * photo.height * 0.575),
				regular: photo.urls.regular,
				download: photo.urls.download,
				download_location: photo.urls.download_location,
				userName: photo.user.name,
				userProfile: `${photo.user.links.html}?utm_source=${process.env.UTM_SOURCE}&utm_medium=${process.env.UTM_MEDIUM}`,
			};

			unsplashPhotos.push(photoItem);
		});
	}

	return res.status(200).json({ success: true, data: unsplashPhotos });
}
