import { useState, useEffect } from "react";
import axios from "axios";
import Button from "../Button";
import styles from "./Image.module.scss";
import Toast from "../../../dashboard-components/Toast";
import Masonry from "react-masonry-css";
import Image from "./Image";
import ImageUploadPreview from "./ImageUploadPreview";

export default function MediaLibrary({ active = false }) {
	const [mediaLibraryImages, setMediaLibraryImages] = useState([]);
	const [uploading, setUploading] = useState(false);
	const [page, setPage] = useState(1);
	const [loading, setLoading] = useState(true);
	const [requestCancelToken, setRequestCancelToken] = useState();
	const [showLoadMore, setShowLoadMore] = useState(false);
	const [toastMessage, setToastMessage] = useState(false);
	const [toastVisible, setToastVisible] = useState(false);
	const [toastType, setToastType] = useState("default");
	const [toastDuration, setToastDuration] = useState(3000);

	/**
	 * Get images from user's media library
	 */
	useEffect(() => {
		const localMediaLibraryImages = JSON.parse(localStorage.getItem("mediaLibraryImages"));
		const localMediaLibraryImagesDate = parseInt(localStorage.getItem("mediaLibraryImagesDate"));
		const localMediaLibraryImagesNextCursor = localStorage.getItem("mediaLibraryNextCursors");
		const oneHour = 3600000;

		let source = axios.CancelToken.source();

		const getImages = async () => {
			setLoading(true);
			try {
				const result = await axios(`${process.env.APP_URL}/api/editor/media`, { cancelToken: source.token });

				if (result.data.success !== true) {
					console.log(result);
					setToastMessage("Can't load media library images.");
					setToastType("error");
					setToastDuration(3000);
					setToastVisible(true);
					return;
				}

				setMediaLibraryImages(result.data.userImages);
				setPage(result.data.nextCursor);

				if (result.data.nextCursor !== "") {
					setShowLoadMore(true);
					setPage(result.data.nextCursor);
				}

				setLoading(false);

				localStorage.setItem("mediaLibraryImagesDate", Date.now());
				localStorage.setItem("mediaLibraryImages", JSON.stringify(result.data.userImages));
				localStorage.setItem("mediaLibraryNextCursors", result.data.nextCursor);
			} catch (error) {
				if (axios.isCancel(error)) {
					return;
				}

				console.log(error);
				setToastMessage("Can't load media library images.");
				setToastType("error");
				setToastDuration(3000);
				setToastVisible(true);
			}
		};

		// load data from localstorage
		const loadImages = () => {
			setMediaLibraryImages(localMediaLibraryImages);
			setPage(localMediaLibraryImagesNextCursor);
			if (localMediaLibraryImagesNextCursor !== "") {
				setShowLoadMore(true);
			}
			setLoading(false);
		};

		if (localMediaLibraryImages && localMediaLibraryImagesDate && localMediaLibraryImagesNextCursor && Date.now() - localMediaLibraryImagesDate > oneHour) {
			// local storage timestamp is older than 1 hour, get images from API
			getImages();
		} else if (localMediaLibraryImages && localMediaLibraryImagesDate && localMediaLibraryImagesNextCursor) {
			// get images from localStorage
			loadImages();
		} else {
			// no data in localstorage, get images from API
			getImages();
		}

		return () => source.cancel();
	}, []);

	/**
	 * Read selected image as data url to upload
	 * @param {object} e Event target object
	 */
	const readSelectedImage = (e) => {
		const image = e.target.files[0];
		// check selected file size
		if (image.size > 2097152) {
			alert("Please, select a smaller file (max 2MB)");
			return;
		}
		const reader = new FileReader();
		reader.readAsDataURL(image);
		reader.onloadend = () => {
			// add image to array for upload preview
			const newImage = {
				type: "preview",
				thumb: reader.result,
			};
			const imagesTemp = [...mediaLibraryImages];
			imagesTemp.unshift(newImage);
			setMediaLibraryImages(imagesTemp);
			// upload image
			uploadImage(reader.result);
		};
	};

	/**
	 * Add new image to the media library
	 */
	const uploadImage = async (image) => {
		setUploading(true);
		let imagesTemp = [...mediaLibraryImages];

		if (requestCancelToken) {
			requestCancelToken.cancel();
		}

		let source = axios.CancelToken.source();
		setRequestCancelToken(source);

		try {
			const uploadResult = await axios.put(
				`${process.env.APP_URL}/api/editor/media/upload`,
				{
					image,
				},
				{
					headers: {
						"Content-Type": "application/json",
					},
				},
				{ cancelToken: source.token }
			);

			// check upload result
			if (uploadResult.data.success !== true) {
				// remove upload preview image from state
				imagesTemp.shift(imagesTemp);
				setMediaLibraryImages(imagesTemp);

				console.log(uploadResult);
				setToastMessage("Can't upload image. Please, try again.");
				setToastType("error");
				setToastDuration(6000);
				setToastVisible(true);
			} else {
				// add uploaded file to mediaLibraryImages array
				imagesTemp.unshift(uploadResult.data.image);
				setMediaLibraryImages(imagesTemp);
				localStorage.setItem("mediaLibraryImagesDate", Date.now());
				localStorage.setItem("mediaLibraryImages", JSON.stringify(imagesTemp));
			}
		} catch (error) {
			if (axios.isCancel(error)) {
				return;
			}
			// remove upload preview image from state
			imagesTemp.shift(imagesTemp);
			setMediaLibraryImages(imagesTemp);
			console.log(error);
			setToastMessage("Can't upload image. Please, try again.");
			setToastType("error");
			setToastDuration(6000);
			setToastVisible(true);
		}

		setUploading(false);
	};

	/**
	 * Load more images from the media libraray
	 */
	const loadMoreResult = async () => {
		setLoading(true);

		if (requestCancelToken) {
			requestCancelToken.cancel();
		}

		let source = axios.CancelToken.source();
		setRequestCancelToken(source);

		try {
			const result = await axios(`${process.env.APP_URL}/api/editor/media?page=${page}`, { cancelToken: source.token });

			if (result.data.success !== true) {
				console.log(result);
				setToastMessage("Can't load media library images.");
				setToastType("error");
				setToastDuration(3000);
				setToastVisible(true);
				return;
			}

			setMediaLibraryImages([...mediaLibraryImages, ...result.data.userImages]);
			setPage(result.data.nextCursor);
			if (result.data.nextCursor === "") {
				setShowLoadMore(false);
			}
		} catch (error) {
			if (axios.isCancel(error)) {
				return;
			}
			console.log(error);
			setToastMessage("Can't load media library images.");
			setToastType("error");
			setToastDuration(3000);
			setToastVisible(true);
			return;
		}

		setLoading(false);
	};

	return (
		<div className={`${!active ? "hidden" : ""}`}>
			<div className={styles.imageUploadContainer}>
				<Button label={`${uploading ? "Uploading image..." : "Upload New Image"}`} disabled={uploading} />
				<input type="file" accept=".jpg,.jpeg,.gif,.png,.svg" onChange={(e) => readSelectedImage(e)} name="image" disabled={uploading} />
				<small>(max 2MB)</small>
			</div>
			<div className={styles.imageList}>
				{mediaLibraryImages.length === 0 && !loading && <p className="align--center">There are no images in your media library</p>}

				{mediaLibraryImages.length > 0 && (
					<Masonry breakpointCols={2} className={styles.imageGrid} columnClassName={styles.imageGridColumn}>
						{mediaLibraryImages.map((image) => {
							return image.type && image.type === "preview" ? <ImageUploadPreview key="image-upload-preview" thumb={image.thumb} caption={"Uploading image..."} /> : <Image key={`media-library-${image.id}`} thumb={image.thumb} src={image.src} caption={`Media library ${image.id}`} width={image.width} height={image.height} />;
						})}
					</Masonry>
				)}

				{mediaLibraryImages.length === 0 && loading && <p className="align--center">Loading images...</p>}

				{showLoadMore && page !== "" && <Button label={`${loading ? "loading..." : "Load more"}`} disabled={loading || uploading} onClick={() => loadMoreResult()} buttonType="buttonOutline" />}
			</div>

			{toastVisible && <Toast onClose={() => setToastVisible(false)} duration={toastDuration} type={toastType} content={toastMessage} />}
		</div>
	);
}
