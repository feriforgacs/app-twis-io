import Link from "next/link";
import Image from "next/image";
export default function LinkComponent({ url = "", external = false, children }) {
	return (
		<>
			{external ? (
				<a href={url} target="_blank" rel="noopener noreferrer">
					{children}
					<span className="ml-10 op-5">
						<Image src="/images/icons/icon-link.svg" width={20} height={20} />
					</span>
				</a>
			) : (
				<Link href={url}>
					<a>{children}</a>
				</Link>
			)}
		</>
	);
}
