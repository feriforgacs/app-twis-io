import Link from "next/link";

export default function PageTabNavigation({ tabs, activeTabSlug = "" }) {
	return (
		<div className="page-tab-navigation">
			{tabs.map((tab, index) => (
				<div className={`tab ${tab.slug === activeTabSlug ? "tab--active" : ""}`} key={index}>
					<Link href={tab.slug}>
						<a>{tab.label}</a>
					</Link>
				</div>
			))}
		</div>
	);
}
