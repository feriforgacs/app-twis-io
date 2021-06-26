import { useState, useEffect } from "react";
import axios from "axios";
import { DebounceInput } from "react-debounce-input";
import Button from "../Button";
import styles from "./Image.module.scss";
import Toast from "../../../dashboard-components/Toast";
import Masonry from "react-masonry-css";
import Image from "./Image";
import SkeletonImage from "../../skeletons/SkeletonImage";

export default function Gifs({ active = false }) {
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
	 * Get trending giphy gifs
	 */
	useEffect(() => {
		const localGiphyImages = JSON.parse(localStorage.getItem("giphyImages"));
		const localGiphyImagesDate = parseInt(localStorage.getItem("giphyImagesDate"));
		const oneHour = 3600000;

		let source = axios.CancelToken.source();

		// fetch data from api
		const getImages = async () => {
			setLoading(true);
			try {
				const result = await axios(`/api/editor/gif`, { cancelToken: source.token });

				if (result.data.success !== true) {
					console.log(result);
					setLoading(false);
					setToastMessage("Can't load images from GIPHY.");
					setToastType("error");
					setToastDuration(3000);
					setToastVisible(true);
					return;
				}

				setImages(result.data.images);
				localStorage.setItem("giphyImagesDate", Date.now());
				localStorage.setItem("giphyImages", JSON.stringify(result.data.images));
			} catch (error) {
				if (axios.isCancel(error)) {
					return;
				}

				console.log(error);
				setToastMessage("Can't load images from GIPHY.");
				setToastType("error");
				setToastDuration(3000);
				setToastVisible(true);
			}
			setLoading(false);
		};

		// load data from localstorage
		const loadImages = () => {
			setLoading(true);
			setImages(localGiphyImages);
			setLoading(false);
		};

		if (localGiphyImages && localGiphyImagesDate && Date.now() - localGiphyImagesDate > oneHour) {
			// get images from API
			getImages();
		} else if (localGiphyImages && localGiphyImagesDate) {
			// get images from localStorage
			loadImages();
		} else {
			// get images from API
			getImages();
		}

		return () => source.cancel();
	}, []);

	/**
	 * Search images on giphy
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
				const result = await axios(`/api/editor/gif?keyword=${keyword}`, { cancelToken: source.token });

				if (result.data.success !== true) {
					console.log(result);
					setLoading(false);
					setToastMessage("Can't load images from GIPHY.");
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
				setToastMessage("Can't load images from GIPHY.");
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
			const result = await axios(`/api/editor/gif?keyword=${query}&page=${page + 1}`, { cancelToken: source.token });
			if (result.data.success !== true) {
				console.log(result);
				setLoading(false);
				setToastMessage("Can't load images from GIPHY.");
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
			setToastMessage("Can't load images from GIPHY.");
			setToastType("error");
			setToastDuration(3000);
			setToastVisible(true);
		}
		setLoading(false);
	};

	return (
		<div className={`${!active ? "hidden" : ""}`}>
			<div className={`${styles.searchInputContainer} ${loading ? styles.searchInputContainerLoading : ""}`}>
				<DebounceInput className={`${loading ? styles.searchInputLoading : ""}`} placeholder="Search on GIPHY" minLength="3" debounceTimeout="300" onChange={(e) => searchImages(e.target.value)} />

				<a href="https://giphy.com/?utm_source=twis&utm_medium=referral" target="_blank" rel="noreferrer">
					<img src="/images/editor/logo-giphy.png" alt="GIPHY logo" className={styles.giphyLogo} />
				</a>
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
							<Image key={`giphy-${image.id}`} thumb={image.src} src={image.src} caption={`Giphy ${i}`} width={image.width} height={image.height} />
						))}
					</Masonry>
				)}

				{showLoadMore && page !== "" && <Button label={`${loading ? "loading..." : "Load more"}`} disabled={loading} onClick={() => loadMoreResult()} buttonType="buttonOutline" />}
			</div>

			{toastVisible && <Toast onClose={() => setToastVisible(false)} duration={toastDuration} type={toastType} content={toastMessage} />}
		</div>
	);
}
