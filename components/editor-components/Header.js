import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import styles from "./Header.module.scss";

export default function Header() {
	const router = useRouter();
	return (
		<div id="editor__header" className={styles.header}>
			<div className={styles.logoContainer}>
				<Link href="/dashboard">
					<a>
						<Image src="/images/logo-white.svg" alt={`${process.env.APP_NAME} logo`} className="logo" width={80} height={28} onClick={() => router.push("/dashboard")} title="Back to the dashboard" />
					</a>
				</Link>
			</div>
		</div>
	);
}
