import Cors from "cors";
import initMiddleware from "../../../../lib/InitMiddleware";
import AuthCheck from "../../../../lib/AuthCheck";
import axios from "axios";

const cors = initMiddleware(
	Cors({
		methods: ["GET"],
	})
);

export default async function GifRequestHandler(req, res) {
	await cors(req, res);

	const authStatus = await AuthCheck(req, res);
	if (!authStatus) {
		res.end();
		return;
	}

	const keyword = req.query.keyword || "";
	const page = parseInt(req.query.page) || 1;

	let giphyResult = [];

	if (page > 1 && keyword !== "") {
		// load more gifs
		try {
			giphyResult = await axios.get("https://api.giphy.com/v1/gifs/search", {
				params: {
					api_key: process.env.GIPHY_API_KEY,
					limit: process.env.MEDIA_LIBRARY_LIMIT,
					q: keyword,
					offset: process.env.MEDIA_LIBRARY_LIMIT * (page - 1),
				},
			});
		} catch (error) {
			console.log(error);
			return res.status(400).json({ success: false, error });
		}
	} else if (keyword !== "") {
		// search gifs
		try {
			giphyResult = await axios.get("https://api.giphy.com/v1/gifs/search", {
				params: {
					api_key: process.env.GIPHY_API_KEY,
					limit: process.env.MEDIA_LIBRARY_LIMIT,
					q: keyword,
				},
			});
		} catch (error) {
			console.log(error);
			return res.status(400).json({ success: false, error });
		}
	} else {
		// default - show trending gifs
		try {
			giphyResult = await axios.get("https://api.giphy.com/v1/gifs/trending", {
				params: {
					api_key: process.env.GIPHY_API_KEY,
					limit: process.env.MEDIA_LIBRARY_LIMIT,
					offset: process.env.MEDIA_LIBRARY_LIMIT * (page - 1),
				},
			});
		} catch (error) {
			console.log(error);
			return res.status(400).json({ success: false, error });
		}
	}

	let giphyGifs = [];

	if (giphyResult.data && giphyResult.data.data) {
		for (let key in giphyResult.data.data) {
			const photoItem = {
				id: giphyResult.data.data[key].id,
				/* thumb: giphyResult.data.data[key].images.preview.mp4,
        regular: giphyResult.data.data[key].images.fixed_height.mp4,
        regular_width: giphyResult.data.data[key].images.fixed_height.width,
        regular_height: giphyResult.data.data[key].images.fixed_height.height, */
				src: giphyResult.data.data[key].images.original.url,
				width: giphyResult.data.data[key].images.original.width,
				height: giphyResult.data.data[key].images.original.height,
			};

			giphyGifs.push(photoItem);
		}
	}

	return res.status(200).json({ success: true, images: giphyGifs });
}
