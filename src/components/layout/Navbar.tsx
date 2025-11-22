import Link from "next/link";
import Image from "next/image";
import styles from "./Navbar.module.css";
import Container from "../ui/Container";
import CartBadge from "../cart/CartBadge";
import Menu from "./Menu";
import type { MenuItem } from "@app/_lib/wp/queries/layout-query";

type NavbarProps = {
  logo?: {
    altText?: string;
    sourceUrl?: string;
  };
  menuItems?: MenuItem[];
};

export default function Navbar({ logo, menuItems }: NavbarProps) {
  return (
    <header className={styles.header}>
      <Container>
        <div className={styles.wrapper}>
          <Link href="/" className={styles.logo}>
            {logo?.sourceUrl ? (
              <Image
                priority
                src={logo.sourceUrl}
                alt={logo.altText || "ChiroStretch"}
                width={200}
                height={50}
                quality={75}
              />
            ) : (
              <>
                <span className={styles.logoChiro}>Chiro</span>
                <span className={styles.logoStretch}>Stretch</span>
              </>
            )}
          </Link>

          {menuItems && menuItems.length > 0 && (
            <nav className={styles.nav} aria-label="Main navigation">
              <ul className={styles.menuList}>
                {menuItems.map((item) => (
                  <Menu key={item.id} item={item} variant="header" />
                ))}
              </ul>
            </nav>
          )}

          <div className={styles.rightSide}>
            <a href="tel:+17202902364" className={styles.phone}>
              (720) 290-2364
            </a>
            <CartBadge />
          </div>
        </div>
      </Container>
    </header>
  );
}
