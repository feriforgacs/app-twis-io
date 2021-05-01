import Head from "next/head";
import { useEffect, useState } from "react";
import Router, { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/client";
import Image from "next/image";
import Link from "next/link";
import NProgress from "nprogress";
import SidebarNavItem from "./SidebarNavItem";
import Usage from "./account-components/Usage";

Router.onRouteChangeStart = () => {
	NProgress.start();
};
Router.onRouteChangeComplete = () => {
	NProgress.done();
};

Router.onRouteChangeError = () => {
	NProgress.done();
};

export default function Sidebar() {
	const [session] = useSession();
	const router = useRouter();
	const [activeNavItem, setActiveNavItem] = useState();

	useEffect(() => {
		if (router.pathname) {
			setActiveNavItem(router.pathname.replace("/", ""));
		}
	}, [router.pathname]);

	const doSignOut = (e) => {
		e.preventDefault();
		signOut({ callbackUrl: `${process.env.APP_URL}/?logout=1` });
	};

	return (
		<div id="page__sidebar">
			<Head>
				<script src="https://cdn.paddle.com/paddle/paddle.js"></script>
			</Head>
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
				<p className="sidebar__account-name">
					{session.user.name ? session.user.name : ""}
					{session.user.name && session.user.email ? (
						<small>
							<br />
							{session.user.email}
						</small>
					) : (
						<>{session.user.email}</>
					)}
				</p>

				<Usage />

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
