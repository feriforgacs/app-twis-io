import Cors from "cors";
import { getSession } from "next-auth/client";
import cloudinary from "cloudinary";
import initMiddleware from "../../../../lib/InitMiddleware";
import AuthCheck from "../../../../lib/AuthCheck";

const cors = initMiddleware(
	Cors({
		methods: ["GET"],
	})
);

export default async function ListHandler(req, res) {
	await cors(req, res);

	const authStatus = await AuthCheck(req, res);
	if (!authStatus) {
		res.end();
		return;
	}

	const session = await getSession({ req });
	let nextCursor = req.query.page || "";

	cloudinary.config({
		cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
		api_key: process.env.CLOUDINARY_API_KEY,
		api_secret: process.env.CLOUDINARY_API_SECRET,
	});

	try {
		const images = await cloudinary.v2.search.expression(`folder:twis/uploads/${session.user.id}`).sort_by("created_at", "desc").max_results(1).next_cursor(nextCursor).execute();

		let userImages = [];
		if (images.resources.length > 0) {
			images.resources.map((image) => {
				const imageItem = {
					id: image.public_id,
					thumb: `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/c_thumb,w_200/v${image.version}/${image.public_id}.${image.format}`,
					src: image.secure_url,
					width: image.width,
					height: image.height,
				};
				userImages.push(imageItem);
			});
		}

		if (images.next_cursor) {
			nextCursor = images.next_cursor;
		} else {
			nextCursor = "";
		}

		return res.status(200).json({ success: true, data: { userImages, nextCursor } });
	} catch (error) {
		console.log(error);
		return res.status(400).json({ success: false, error });
	}
}
