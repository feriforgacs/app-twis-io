import Head from "next/head";

export default function Favicons() {
	return (
		<Head>
			<link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.png" />
			<link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png" />
			<link rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16x16.png" />
			<link rel="manifest" href="/favicons/site.webmanifest" />
			<link rel="mask-icon" href="/favicons/safari-pinned-tab.svg" color="#5a38fd" />
			<meta name="msapplication-TileColor" content="#5a38fd" />
			<meta name="theme-color" content="#5a38fd" />
		</Head>
	);
}
