import { useState, useEffect } from "react";
import axios from "axios";
import { DebounceInput } from "react-debounce-input";
import Button from "../Button";
import styles from "../image-components/Image.module.scss";
import Toast from "../../../dashboard-components/Toast";
import Masonry from "react-masonry-css";
import Sticker from "./Sticker";
import SkeletonImage from "../../skeletons/SkeletonImage";

export default function StickerList({ active = false }) {
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
	 * Get trending stickers
	 */
	useEffect(() => {
		const localGiphyStickers = JSON.parse(localStorage.getItem("giphyStickers"));
		const localGiphyStickersDate = parseInt(localStorage.getItem("giphyStickersDate"));
		const oneHour = 3600000;

		let source = axios.CancelToken.source();

		const getImages = async () => {
			setLoading(true);
			try {
				const result = await axios(`/api/editor/sticker`, { cancelToken: source.token });

				if (result.data.success !== true) {
					console.log(result);
					setLoading(false);
					setToastMessage("Can't load stickers from GIPHY.");
					setToastType("error");
					setToastDuration(3000);
					setToastVisible(true);
					return;
				}

				setImages(result.data.images);
				localStorage.setItem("giphyStickersDate", Date.now());
				localStorage.setItem("giphyStickers", JSON.stringify(result.data.images));
			} catch (error) {
				if (axios.isCancel(error)) {
					return;
				}

				console.log(error);
				setToastMessage("Can't load stickers from GIPHY.");
				setToastType("error");
				setToastDuration(3000);
				setToastVisible(true);
			}
			setLoading(false);
		};

		// load data from localstorage
		const loadImages = () => {
			setLoading(true);
			setImages(localGiphyStickers);
			setLoading(false);
		};

		if (localGiphyStickers && localGiphyStickersDate && Date.now() - localGiphyStickersDate > oneHour) {
			// get images from API
			getImages();
		} else if (localGiphyStickers && localGiphyStickersDate) {
			// get images from localStorage
			loadImages();
		} else {
			// get images from API
			getImages();
		}

		return () => source.cancel();
	}, []);

	/**
	 * Search stickers on giphy
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
				const result = await axios(`/api/editor/sticker?keyword=${keyword}`, { cancelToken: source.token });

				if (result && result.data.success !== true) {
					console.log(result);
					setLoading(false);
					setToastMessage("Can't load stickers from GIPHY.");
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
				setToastMessage("Can't load stickers from GIPHY.");
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
			const result = await axios(`/api/editor/sticker?keyword=${query}&page=${page + 1}`, { cancelToken: source.token });
			if (result.data.success !== true) {
				console.log(result);
				setLoading(false);
				setToastMessage("Can't load sticker from GIPHY.");
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
			setToastMessage("Can't load stickers from GIPHY.");
			setToastType("error");
			setToastDuration(3000);
			setToastVisible(true);
		}
		setLoading(false);
	};

	return (
		<div className={`${!active ? "hidden" : ""}`}>
			<div className={`${styles.searchInputContainer} ${loading ? styles.searchInputContainerLoading : ""} mt-20`}>
				<DebounceInput className={`${loading ? styles.searchInputLoading : ""}`} placeholder="Search for stickers on GIPHY" minLength="3" debounceTimeout="300" onChange={(e) => searchImages(e.target.value)} />

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
							<Sticker key={`sticker-${image.id}`} thumb={image.src} src={image.src} caption={`Sticker ${i}`} width={image.width} height={image.height} />
						))}
					</Masonry>
				)}

				{showLoadMore && page !== "" && images.length !== 0 && <Button label={`${loading ? "loading..." : "Load more"}`} disabled={loading} onClick={() => loadMoreResult()} buttonType="buttonOutline" />}
			</div>

			{toastVisible && <Toast onClose={() => setToastVisible(false)} duration={toastDuration} type={toastType} content={toastMessage} />}
		</div>
	);
}
