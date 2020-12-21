import Image from "next/image";
import Link from "next/link";

export default function SidebarNavItem({ activeNavItem, navItemHref, navItemIcon, navItemLabel }) {
	return (
		<div className={`nav-item ${activeNavItem == navItemHref ? "nav-item--active" : ""}`}>
			<Link href={`/${navItemHref}`}>
				<a>
					<span className="nav-item__icon">
						<Image src={`/images/icons/icon-${navItemIcon}${activeNavItem == navItemHref ? "--active" : ""}.svg`} width={20} height={20} alt={`${navItemLabel} icon`} />
					</span>
					<span className="nav-item__label">{navItemLabel}</span>
				</a>
			</Link>
		</div>
	);
}
