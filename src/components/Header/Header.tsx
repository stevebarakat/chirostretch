"use client";
import { useState } from "react";
import Hamburger from "hamburger-react";
import { Menu } from "@/components/Menu";
import { AccountMenu } from "./AccountMenu";
import { TopMenu } from "./TopMenu";
import styles from "./Header.module.css";
import type { MenuItem } from "@/lib/graphql/queries";
import { Logo } from "@/components/Logo";

type HeaderProps = {
  logo?: {
    altText?: string;
    sourceUrl?: string;
    srcSet?: string;
    sizes?: string;
    mediaDetails?: {
      width?: number;
      height?: number;
    };
  };
  menuItems?: MenuItem[];
};

export default function Header({ logo, menuItems }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className={styles.siteHeader}>
      <div className={styles.topBar}>
        <TopMenu menuItems={menuItems} />
      </div>
      <div className={styles.mainNav}>
        <button
          type="button"
          className={styles.toggleMobileBtn}
          onClick={() => setMobileOpen((mobileOpen) => !mobileOpen)}
          aria-expanded={mobileOpen}
          aria-controls="main-navigation"
          aria-label="Toggle navigation menu"
        >
          <Hamburger label="toggle menu" toggled={mobileOpen} size={20} />
        </button>
        <nav
          id="main-navigation"
          className={styles.nav}
          aria-label="Main navigation"
          style={
            {
              "--toggleMobile": mobileOpen
                ? "translateX(0)"
                : " translateX(-100%)",
            } as React.CSSProperties
          }
        >
          <div className={styles.navContainer}>
            <Logo isMobile={false} logo={logo} />
            <ul className={styles.menu}>
              {menuItems?.map((item) => (
                <Menu setMobileOpen={setMobileOpen} key={item.id} item={item} />
              ))}
            </ul>
            <AccountMenu />
          </div>
        </nav>
        <Logo isMobile={true} logo={logo} />
      </div>
    </header>
  );
}
