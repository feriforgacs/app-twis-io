import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import Head from "next/head";
import styles from "./Header.module.scss";

export default function Header({ campaignName = "" }) {
	const [name, setName] = useState(campaignName);
	const router = useRouter();

	const updateData = (key, value) => {
		console.log(key, value);
	};

	return (
		<>
			<Head>
				<title>
					{name} - {process.env.APP_NAME}
				</title>
			</Head>
			<div id="editor__header" className={styles.header}>
				<div className={styles.logoContainer}>
					<Link href="/dashboard">
						<a>
							<Image src="/images/logo-white.svg" alt={`${process.env.APP_NAME} logo`} className="logo" width={80} height={28} onClick={() => router.push("/dashboard")} title="Back to the dashboard" />
						</a>
					</Link>
				</div>

				<Link href="/dashboard">
					<a>Dashboard</a>
				</Link>

				<span className={styles.separator}>&#8725;</span>

				<Link href="/dashboard/campaigns/">
					<a>Campaigns</a>
				</Link>

				<span className={styles.separator}>&#8725;</span>

				<form
					className={styles.campaignNameContainer}
					onSubmit={(e) => {
						e.preventDefault();
						updateData("name", name);
					}}
				>
					<input type="text" value={name} onChange={(e) => setName(e.target.value)} />
					<span className={styles.editIcon}>
						<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#000000" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
							<polygon points="14 2 18 6 7 17 3 17 3 13 14 2"></polygon>
							<line x1="3" y1="20" x2="20" y2="20"></line>
						</svg>
					</span>
				</form>
			</div>
		</>
	);
}
