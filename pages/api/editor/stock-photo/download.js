import Cors from "cors";
import initMiddleware from "../../../../lib/InitMiddleware";
import AuthCheck from "../../../../lib/AuthCheck";
import { createApi } from "unsplash-js";

const cors = initMiddleware(
	Cors({
		methods: ["GET"],
	})
);

export default async function DownloadTriggerHandler(req, res) {
	await cors(req, res);

	const authStatus = await AuthCheck(req, res);
	if (!authStatus) {
		res.end();
		return;
	}

	const imageId = req.query.id;

	if (!imageId) {
		return res.status(400).json({ success: false, error: "image id is required" });
	}

	const unsplash = new createApi({
		accessKey: process.env.UNSPLASH_ACCESS_KEY,
	});

	try {
		const downloadTrigger = await unsplash.photos.get({ photoId: "mtNweauBsMQ" });
		if (downloadTrigger.type === "success") {
			const photo = downloadTrigger.response;

			await unsplash.photos.trackDownload({
				downloadLocation: photo.links.download_location,
			});

			return res.status(200).json({ success: true });
		} else {
			return res.status(downloadTrigger.status).json({ success: false });
		}
	} catch (error) {
		return res.status(400).json({ success: false, error });
	}
}
