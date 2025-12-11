"use client";
import { useState } from "react";
import Hamburger from "hamburger-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu } from "@/components/Menu";
import CartSummary from "@/components/layout/CartSummary";
import SearchInput from "@/components/layout/SearchInput";
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

function isShopPage(pathname: string): boolean {
  const path = pathname.toLowerCase();
  return (
    path.startsWith("/shop") ||
    path.startsWith("/cart") ||
    path.startsWith("/checkout") ||
    path.startsWith("/products")
  );
}

export default function Header({ logo, menuItems }: HeaderProps) {
  const pathname = usePathname();
  const showCart = isShopPage(pathname);
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
          <SearchInput />
          {showCart && <CartSummary />}
        </div>
      </nav>
      <Logo isMobile={true} logo={logo} />
    </header>
  );
}
