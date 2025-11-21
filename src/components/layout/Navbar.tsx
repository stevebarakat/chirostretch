import Link from "next/link";
import Image from "next/image";
import styles from "./Navbar.module.css";
import Container from "../ui/Container";
import CartBadge from "../cart/CartBadge";

type NavbarProps = {
  logo?: {
    altText?: string;
    sourceUrl?: string;
  };
};

export default function Navbar({ logo }: NavbarProps) {
  return (
    <header className={styles.header}>
      <Container>
        <div className={styles.wrapper}>
          <Link href="/" className={styles.logo}>
            {logo?.sourceUrl ? (
              <Image
                src={logo.sourceUrl}
                alt={logo.altText || "ChiroStretch"}
                width={200}
                height={50}
                className={styles.logoImage}
                style={{ width: "auto", height: "auto" }}
                priority
                quality={75}
              />
            ) : (
              <>
                <span className={styles.logoChiro}>Chiro</span>
                <span className={styles.logoStretch}>Stretch</span>
              </>
            )}
          </Link>

          <nav className={styles.nav}>
            <Link href="/franchise-opportunities" className={styles.navLink}>
              Franchise
            </Link>
            <Link href="/training-and-certification" className={styles.navLink}>
              Training
            </Link>
            <Link href="/blog" className={styles.navLink}>
              Blog
            </Link>
            <Link href="/about" className={styles.navLink}>
              About
            </Link>
            <Link href="/contact" className={styles.navLink}>
              Request Info
            </Link>
          </nav>

          <div className={styles.rightSide}>
            <a href="tel:+17202902364" className={styles.phone}>
              (720) 290-2364
            </a>
            <CartBadge /> {/* ← NEW */}
          </div>
        </div>
      </Container>
    </header>
  );
}
