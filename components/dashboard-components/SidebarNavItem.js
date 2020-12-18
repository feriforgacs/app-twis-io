import Link from "next/link";

export default function SidebarNavItem({ activeNavItem, setActiveNavItem, navItemHref, navItemIcon, navItemLabel }) {
	return (
		<div className={`nav-item ${activeNavItem == navItemHref ? "nav-item--active" : ""}`}>
			<Link href={`/${navItemHref}`} onClick={() => setActiveNavItem(navItemHref)}>
				<a>
					<span className="nav-item__icon">{navItemIcon}</span>
					<span className="nav-item__label">{navItemLabel}</span>
				</a>
			</Link>
		</div>
	);
}
