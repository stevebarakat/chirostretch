"use client";

import Link from "next/link";
import Image from "next/image";
import { User } from "lucide-react";
import Container from "@/components/ui/Container";
import Menu from "./Menu";
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
          <Link href="/my-account" className={styles.accountLink}>
            <User size={20} aria-hidden="true" />
            <span>My Account</span>
          </Link>
        </div>
        <div className={styles.bottomRow}>
          <nav className={styles.nav} aria-label="Main navigation">
            <ul className={styles.navList}>
              {menuItems?.map((item) => (
                <Menu key={item.id} item={item} variant="header" />
              ))}
            </ul>
          </nav>
        </div>
      </Container>
    </header>
  );
}
