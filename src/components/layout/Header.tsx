import Link from "next/link";
import Image from "next/image";
import { Search, ShoppingCart } from "lucide-react";
import Container from "@/components/ui/Container";
import Menu from "./Menu";
import CartSummary from "./CartSummary";
import styles from "./Header.module.css";
import type { MenuItem } from "@app/_lib/wp/queries/layout-query";

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
  return (
    <header className={styles.header}>
      <Container>
        <div className={styles.topRow}>
          <Link href="/" className={styles.logo}>
            {logo?.sourceUrl ? (
              <Image
                src={logo.sourceUrl}
                alt={logo.altText || "Chiro Stretch"}
                width={logo.mediaDetails?.width || 200}
                height={logo.mediaDetails?.height || 50}
                className={styles.logoImage}
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
          <div className={styles.search}>
            <Search
              className={styles.searchIcon}
              size={20}
              aria-hidden="true"
            />
            <input
              type="search"
              placeholder="Search products..."
              className={styles.searchInput}
              aria-label="Search products"
            />
          </div>
        </div>
        <div className={styles.bottomRow}>
          <nav className={styles.nav} aria-label="Main navigation">
            <ul className={styles.navList}>
              {menuItems?.map((item) => (
                <Menu key={item.id} item={item} variant="header" />
              ))}
            </ul>
          </nav>
          <CartSummary />
        </div>
      </Container>
    </header>
  );
}
