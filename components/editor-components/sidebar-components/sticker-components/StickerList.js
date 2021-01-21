import { useState, useEffect } from "react";
import axios from "axios";
import { DebounceInput } from "react-debounce-input";
import Button from "../Button";
import styles from "../image-components/Image.module.scss";
import Toast from "../../../dashboard-components/Toast";
import Masonry from "react-masonry-css";
import Sticker from "./Sticker";

export default function StickerList() {
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
	 * Get trending stickers
	 */
	useEffect(() => {
		const localGiphyStickers = JSON.parse(localStorage.getItem("giphyStickers"));
		const localGiphyStickersDate = parseInt(localStorage.getItem("giphyStickersDate"));
		const oneHour = 3600000;

		const getImages = async () => {
			setLoading(true);
			try {
				const result = await axios(`${process.env.APP_URL}/api/editor/sticker`);

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
	}, []);

	/**
	 * Search stickers on giphy
	 * @param {string} keyword Search keyword
	 */
	const searchImages = async (keyword) => {
		if (keyword.length >= 3) {
			setQuery(keyword);
			setLoading(true);
			try {
				const result = await axios(`${process.env.APP_URL}/api/editor/sticker?keyword=${keyword}`);

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
				setShowLoadMore(true);
				setPage(1);
			} catch (error) {
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
		try {
			const result = await axios(`${process.env.APP_URL}/api/editor/sticker?keyword=${query}&page=${page + 1}`);
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
			console.log(error);
			setToastMessage("Can't load stickers from GIPHY.");
			setToastType("error");
			setToastDuration(3000);
			setToastVisible(true);
		}
		setLoading(false);
	};

	return (
		<>
			<div className={`${styles.searchInputContainer} ${loading ? styles.searchInputContainerLoading : ""} mt-20`}>
				<DebounceInput className={`${loading ? styles.searchInputLoading : ""}`} placeholder="Search for stickers on GIPHY" minLength="3" debounceTimeout="300" onChange={(e) => searchImages(e.target.value)} />
				<p className="align--center">
					Powered by{" "}
					<a href="https://giphy.com/?utm_source=twis&utm_medium=referral" target="_blank" rel="noreferrer">
						<img src="/images/editor/logo-giphy.svg" alt="GIPHY logo" />
					</a>
				</p>
			</div>

			<div className={styles.imageList}>
				{images.length === 0 && !loading && <p className="align--center">No result</p>}

				{images.length === 0 && loading && <p className="align--center">Loading images...</p>}

				{images.length > 0 && (
					<Masonry breakpointCols={2} className={styles.imageGrid} columnClassName={styles.imageGridColumn}>
						{images.map((image, i) => (
							<Sticker key={`sticker-${image.id}`} thumb={image.src} src={image.src} caption={`Sticker ${i}`} width={image.width} height={image.height} />
						))}
					</Masonry>
				)}

				{showLoadMore && page !== "" && <Button label={`${loading ? "loading..." : "Load more"}`} disabled={loading} onClick={() => loadMoreResult()} buttonType="buttonOutline" />}
			</div>

			{toastVisible && <Toast onClose={() => setToastVisible(false)} duration={toastDuration} type={toastType} content={toastMessage} />}
		</>
	);
}
