import { useState, useEffect } from "react";
import axios from "axios";
import { DebounceInput } from "react-debounce-input";
import Button from "../Button";
import styles from "./Image.module.scss";
import Toast from "../../../dashboard-components/Toast";
import Masonry from "react-masonry-css";
import Image from "./Image";
import SkeletonImage from "../../skeletons/SkeletonImage";

export default function StockImages({ active = false }) {
	const [images, setImages] = useState([]);
	const [page, setPage] = useState(1);
	const [loading, setLoading] = useState(false);
	const [showLoadMore, setShowLoadMore] = useState(false);
	const [query, setQuery] = useState("");
	const [requestCancelToken, setRequestCancelToken] = useState();
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

		let source = axios.CancelToken.source();

		const getImages = async () => {
			setLoading(true);
			try {
				const result = await axios(`/api/editor/stock-photo`, { cancelToken: source.token });

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
				if (axios.isCancel(error)) {
					return;
				}

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

		return () => source.cancel();
	}, []);

	/**
	 * Search images on unsplash
	 * @param {string} keyword Search keyword
	 */
	const searchImages = async (keyword) => {
		if (keyword.length >= 3) {
			setQuery(keyword);
			setLoading(true);

			if (requestCancelToken) {
				requestCancelToken.cancel();
			}

			let source = axios.CancelToken.source();
			setRequestCancelToken(source);

			try {
				const result = await axios(`/api/editor/stock-photo?keyword=${keyword}`, { cancelToken: source.token });

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
				if (axios.isCancel(error)) {
					return;
				}

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

		if (requestCancelToken) {
			requestCancelToken.cancel();
		}

		let source = axios.CancelToken.source();
		setRequestCancelToken(source);

		try {
			const result = await axios(`/api/editor/stock-photo?keyword=${query}&page=${page + 1}`, { cancelToken: source.token });
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
			if (axios.isCancel(error)) {
				return;
			}

			console.log(error);
			setToastMessage("Can't load images from Unsplash.");
			setToastType("error");
			setToastDuration(3000);
			setToastVisible(true);
		}
		setLoading(false);
	};

	return (
		<div className={`${!active ? "hidden" : ""}`}>
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

				{images.length === 0 && loading && (
					<div className={styles.imageGrid}>
						<div className={styles.imageGridColumn}>
							<SkeletonImage items={5} />
						</div>

						<div className={styles.imageGridColumn}>
							<SkeletonImage items={5} />
						</div>
					</div>
				)}

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
		</div>
	);
}
