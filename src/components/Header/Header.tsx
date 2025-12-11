"use client";
import { useState } from "react";
import Link from "next/link";
import Hamburger from "hamburger-react";
import { User } from "lucide-react";
import { Menu } from "@/components/Menu";
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
      <div
        className={styles.toggleMobileBtn}
        onPointerUp={() => setMobileOpen((mobileOpen) => !mobileOpen)}
      >
        <Hamburger label="toggle menu" toggled={mobileOpen} size={20} />
      </div>
      <nav
        className={styles.nav}
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
          <Link href="/my-account" className={styles.accountLink}>
            <User size={20} aria-hidden="true" />
            <span>My Account</span>
          </Link>
        </div>
      </nav>
      <Logo isMobile={true} logo={logo} />
    </header>
  );
}
