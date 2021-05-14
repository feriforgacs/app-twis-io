import Image from "next/image";
import Link from "next/link";

export default function SidebarNavItem({ currentPath, navItemHref, navItemIcon, navItemLabel }) {
	let currentNavItemActive = false;
	if (currentPath) {
		currentNavItemActive = currentPath.indexOf(navItemHref) === 0 ? true : false;
	}
	return (
		<div className={`nav-item ${currentNavItemActive ? "nav-item--active" : ""}`}>
			<Link href={`/${navItemHref}`}>
				<a>
					<span className="nav-item__icon">
						<Image src={`/images/icons/icon-${navItemIcon}${currentNavItemActive ? "--active" : ""}.svg`} width={20} height={20} alt={`${navItemLabel} icon`} />
					</span>
					<span className="nav-item__label">{navItemLabel}</span>
				</a>
			</Link>
		</div>
	);
}
