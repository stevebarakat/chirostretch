"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Container from "@/components/ui/Container";
import Menu from "./Menu";
import CartSummary from "./CartSummary";
import SearchInput from "./SearchInput";
import styles from "./Header.module.css";
import type { MenuItem } from "@/lib/graphql/queries";

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

  return (
    <header className={styles.header}>
      <Container>
        <div className={styles.topRow}>
          <Link href="/" className={styles.logo}>
            {logo?.sourceUrl ? (
              <Image
                src={logo.sourceUrl}
                alt={logo.altText || "Chiro Stretch"}
                width={
                  logo.mediaDetails?.width ? logo.mediaDetails.width / 4 : 200
                }
                height={
                  logo.mediaDetails?.height ? logo.mediaDetails.height / 4 : 50
                }
                priority
                fetchPriority="high"
              />
            ) : (
              <div className={styles.logoText}>
                <span className={styles.logoChiro}>Chiro</span>
                <span className={styles.logoStretch}>Stretch</span>
              </div>
            )}
          </Link>
          <SearchInput />
        </div>
        <div className={styles.bottomRow}>
          <nav className={styles.nav} aria-label="Main navigation">
            <ul className={styles.navList}>
              {menuItems?.map((item) => (
                <Menu key={item.id} item={item} variant="header" />
              ))}
            </ul>
          </nav>
          {showCart && <CartSummary />}
        </div>
      </Container>
    </header>
  );
}
