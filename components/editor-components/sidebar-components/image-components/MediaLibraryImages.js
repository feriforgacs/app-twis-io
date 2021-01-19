import { useState } from "react";
import axios from "axios";
import Button from "../Button";
import styles from "./Image.module.scss";
import Toast from "../../../dashboard-components/Toast";

export default function MediaLibraryImages() {
	const [mediaLibraryImages, setMediaLibraryImages] = useState([]);
	const [uploading, setUploading] = useState(false);
	const [page, setPage] = useState(1);
	const [loading, setLoading] = useState(false);
	const [showLoadMore, setShowLoadMore] = useState(false);
	const [toastMessage, setToastMessage] = useState(false);
	const [toastVisible, setToastVisible] = useState(false);
	const [toastType, setToastType] = useState("default");
	const [toastDuration, setToastDuration] = useState(3000);

	/**
	 * Read selected image as data url to upload
	 * @param {object} e Event target object
	 */
	const readSelectedImage = (e) => {
		const image = e.target.files[0];
		// check selected file size
		if(image.size > 2097152){
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
				}
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

	return (
		<>
			<div className={styles.imageUploadContainer}>
				<Button label={`${uploading ? "Uploading image..." : "Upload New Image"}`} disabled={uploading} />
				<input type="file" accept=".jpg,.jpeg,.gif,.png,.svg" onChange={(e) => readSelectedImage(e)} name="image" disabled={uploading} />
				<small>(max 2MB)</small>
			</div>
			<div className={styles.imageList}></div>
			{toastVisible && <Toast onClose={() => setToastVisible(false)} duration={toastDuration} type={toastType} content={toastMessage} />}
		</>
	);
}
