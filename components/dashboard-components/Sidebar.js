import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { signOut } from "next-auth/client";
import Image from "next/image";
import Link from "next/link";

import SidebarNavItem from "./SidebarNavItem";

export default function Sidebar() {
	const router = useRouter();
	const [activeNavItem, setActiveNavItem] = useState();

	useEffect(() => {
		if (router.pathname) {
			setActiveNavItem(router.pathname.replace("/", ""));
		}
	});

	const doSignOut = (e) => {
		e.preventDefault();
		signOut({ callbackUrl: `${process.env.APP_URL}/?logout=1` });
	};

	return (
		<div id="page__sidebar">
			<nav className="page__sidebar--top">
				<div className="logo-container">
					<Link href="/dashboard">
						<a>
							<Image src="/images/logo.svg" alt={`${process.env.APP_NAME} logo`} className="logo" width={80} height={28} onClick={() => router.push("/dashboard")} />
						</a>
					</Link>
				</div>
				<SidebarNavItem activeNavItem={activeNavItem} setActiveNavItem={setActiveNavItem} navItemHref="dashboard" navItemIcon="dashboard" navItemLabel="Dashboard" />
				<SidebarNavItem activeNavItem={activeNavItem} setActiveNavItem={setActiveNavItem} navItemHref="campaigns" navItemIcon="campaigns" navItemLabel="Campaigns" />
				<SidebarNavItem activeNavItem={activeNavItem} setActiveNavItem={setActiveNavItem} navItemHref="participants" navItemIcon="participants" navItemLabel="Participants" />
			</nav>

			<nav className="page__sidebar--bottom">
				<SidebarNavItem activeNavItem={activeNavItem} setActiveNavItem={setActiveNavItem} navItemHref="account" navItemIcon="account" navItemLabel="Account" />
				<SidebarNavItem activeNavItem={activeNavItem} setActiveNavItem={setActiveNavItem} navItemHref="help" navItemIcon="help" navItemLabel="Help" />

				<div className="nav-item nav-item--sign-out">
					<a href="#" onClick={(e) => doSignOut(e)}>
						<span className="nav-item__icon">
							<Image src={`/images/icons/icon-sign-out.svg`} width={20} height={20} alt={`Sign out icon`} />
						</span>
						<span className="nav-item__label">Sign out</span>
					</a>
				</div>
			</nav>
		</div>
	);
}
