import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { signOut } from "next-auth/client";
import Image from "next/image";

import SidebarNavItem from "./SidebarNavItem";

export default function Sidebar() {
	const router = useRouter();
	const [activeNavItem, setActiveNavItem] = useState();

	useEffect(() => {
		if (router.pathname) {
			setActiveNavItem(router.pathname.replace("/", ""));
		}
	});

	return (
		<div id="page__sidebar">
			<nav className="page__sidebar--top">
				<div className="logo-container">
					<Image src="/images/logo.svg" alt="TWiS logo" className="logo" width={80} height={28} onClick={() => router.push("/dashboard")} />
				</div>
				<SidebarNavItem activeNavItem={activeNavItem} setActiveNavItem={setActiveNavItem} navItemHref="dashboard" navItemIcon="dashboard" navItemLabel="Dashboard" />
				<SidebarNavItem activeNavItem={activeNavItem} setActiveNavItem={setActiveNavItem} navItemHref="campaigns" navItemIcon="campaigns" navItemLabel="Campaigns" />
				<SidebarNavItem activeNavItem={activeNavItem} setActiveNavItem={setActiveNavItem} navItemHref="participants" navItemIcon="participants" navItemLabel="Participants" />
			</nav>

			<nav className="page__sidebar--bottom">
				<SidebarNavItem activeNavItem={activeNavItem} setActiveNavItem={setActiveNavItem} navItemHref="account" navItemIcon="account" navItemLabel="Account" />
				<SidebarNavItem activeNavItem={activeNavItem} setActiveNavItem={setActiveNavItem} navItemHref="help" navItemIcon="help" navItemLabel="Help" />

				<div className="nav-item">
					<button onClick={() => signOut({ callbackUrl: `${process.env.APP_URL}/?logout=1` })}>Sign out</button>
				</div>
			</nav>
		</div>
	);
}
