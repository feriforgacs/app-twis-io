import { useState, useEffect } from "react";
import axios from "axios";
import { DebounceInput } from "react-debounce-input";
import Button from "../Button";
import styles from "./Image.module.scss";
import Toast from "../../../dashboard-components/Toast";
import Masonry from "react-masonry-css";
import Image from "./Image";

export default function StockImages() {
	const [images, setImages] = useState([]);
	const [page, setPage] = useState(1);
	const [loading, setLoading] = useState(false);
	const [showLoadMore, setShowLoadMore] = useState(false);
	const [query, setQuery] = useState("");
	const [toastMessage, setToastMessage] = useState(false);
	const [toastVisible, setToastVisible] = useState(false);
	const [toastType, setToastType] = useState("default");
	const [toastDuration, setToastDuration] = useState(3000);

	/**
	 * Get latest unsplash photos
	 */
	useEffect(() => {
		const localUnsplashImages = JSON.parse(localStorage.getItem("unsplashImages"));
		const localUnsplashImagesDate = parseInt(localStorage.getItem("unsplashImagesDate"));
		const oneHour = 3600000;

		const getImages = async () => {
			setLoading(true);
			try {
				const result = await axios(`${process.env.APP_URL}/api/editor/stock-photo`);
				if (result.data.success !== true) {
					console.log(result);
					setLoading(false);
					setToastMessage("Can't load images from Unsplash.");
					setToastType("error");
					setToastDuration(3000);
					setToastVisible(true);
					return;
				}

				setImages(result.data.images);
				localStorage.setItem("unsplashImagesDate", Date.now());
				localStorage.setItem("unsplashImages", JSON.stringify(result.data.images));
			} catch (error) {
				console.log(error);
				setToastMessage("Can't load images from Unsplash.");
				setToastType("error");
				setToastDuration(3000);
				setToastVisible(true);
			}

			setLoading(false);
		};

		// load data from localstorage
		const loadImages = () => {
			setLoading(true);
			setImages(localUnsplashImages);
			setLoading(false);
		};

		if (localUnsplashImages && localUnsplashImagesDate && Date.now() - localUnsplashImagesDate > oneHour) {
			// get images from API
			getImages();
		} else if (localUnsplashImages && localUnsplashImagesDate) {
			// get images from localStorage
			loadImages();
		} else {
			// get images from API
			getImages();
		}
	}, []);

	/**
	 * Search images on unsplash
	 * @param {string} keyword Search keyword
	 */
	const searchImages = async (keyword) => {
		if (keyword.length >= 3) {
			setQuery(keyword);
			setLoading(true);
			try {
				const result = await axios(`${process.env.APP_URL}/api/editor/stock-photo?keyword=${keyword}`);

				if (result.data.success !== true) {
					console.log(result);
					setLoading(false);
					setToastMessage("Can't load images from Unsplash.");
					setToastType("error");
					setToastDuration(3000);
					setToastVisible(true);
					return;
				}

				setImages(result.data.images);
				setShowLoadMore(true);
				setPage(1);
			} catch (error) {
				console.log(error);
				setToastMessage("Can't load images from Unsplash.");
				setToastType("error");
				setToastDuration(3000);
				setToastVisible(true);
			}
			setLoading(false);
		}
	};

	/**
	 * Load more search result
	 */
	const loadMoreResult = async () => {
		setPage(page + 1);
		setLoading(true);
		try {
			const result = await axios(`${process.env.APP_URL}/api/editor/stock-photo?keyword=${query}&page=${page + 1}`);
			if (result.data.success !== true) {
				console.log(result);
				setLoading(false);
				setToastMessage("Can't load images from Unsplash.");
				setToastType("error");
				setToastDuration(3000);
				setToastVisible(true);
				return;
			}
			setImages([...images, ...result.data.images]);
			setShowLoadMore(true);
		} catch (error) {
			console.log(error);
			setToastMessage("Can't load images from Unsplash.");
			setToastType("error");
			setToastDuration(3000);
			setToastVisible(true);
		}
		setLoading(false);
	};

	return (
		<>
			<div className={`${styles.searchInputContainer} ${loading ? styles.searchInputContainerLoading : ""}`}>
				<DebounceInput className={`${loading ? styles.searchInputLoading : ""}`} placeholder="Search on Unsplash" minLength="3" debounceTimeout="300" onChange={(e) => searchImages(e.target.value)} />
				<p className="align--center">
					Powered by{" "}
					<a href="https://unsplash.com/?utm_source=twis&utm_medium=referral" target="_blank" rel="noreferrer">
						<img src="/images/editor/logo-unsplash.svg" alt="Unsplash logo" />
					</a>
				</p>
			</div>

			<div className={styles.imageList}>
				{images.length === 0 && !loading && <p className="align--center">No result</p>}

				{images.length === 0 && loading && <p className="align--center">Loading images...</p>}

				{images.length > 0 && (
					<Masonry breakpointCols={2} className={styles.imageGrid} columnClassName={styles.imageGridColumn}>
						{images.map((image, i) => (
							<Image key={`unsplash-${i}`} thumb={image.thumb} src={image.regular} caption={`Unsplash ${i}`} width={image.thumb_width} height={image.thumb_height} unsplashImage={true} unsplashId={image.id} unsplashUserName={image.userName} unsplashUserProfile={image.userProfile} />
						))}
					</Masonry>
				)}

				{showLoadMore && page !== "" && <Button label={`${loading ? "loading..." : "Load more"}`} disabled={loading} onClick={() => loadMoreResult()} buttonType="buttonOutline" />}
			</div>

			{toastVisible && <Toast onClose={() => setToastVisible(false)} duration={toastDuration} type={toastType} content={toastMessage} />}
		</>
	);
}
