import Cors from "cors";
import { getSession } from "next-auth/client";
import { v2 as cloudinary } from "cloudinary";
import initMiddleware from "../../../../lib/InitMiddleware";
import AuthCheck from "../../../../lib/AuthCheck";

const cors = initMiddleware(
	Cors({
		methods: ["PUT"],
	})
);

export const config = {
	api: {
		bodyParser: {
			sizeLimit: "2.5mb",
		},
	},
};

export default async function UploadHandler(req, res) {
	await cors(req, res);

	const authStatus = await AuthCheck(req, res);
	if (!authStatus) {
		res.end();
		return;
	}

	const session = await getSession({ req });

	cloudinary.config({
		cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
		api_key: process.env.CLOUDINARY_API_KEY,
		api_secret: process.env.CLOUDINARY_API_SECRET,
	});

	try {
		const image = await cloudinary.uploader.upload(req.body.image, {
			folder: `twis/uploads/${session.user.id}`,
			overwrite: false,
		});

		const uploadedImage = {
			id: image.public_id,
			thumb: `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/c_thumb,w_200/v${image.version}/${image.public_id}.${image.format}`,
			src: image.secure_url,
			width: image.width,
			height: image.height,
		};

		return res.status(200).json({ success: true, data: uploadedImage });
	} catch (error) {
		return res.status(400).json({ success: false, error });
	}
}
