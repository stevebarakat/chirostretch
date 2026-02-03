"use client";

import { ReactNode } from "react";
import { SearchInput } from "@/components/Layout/SearchInput";
import { CartBadge } from "@/components/Cart";
import styles from "./ArchiveHeader.module.css";

type ArchiveHeaderProps = {
  title: string;
  subtitle?: string;
  showCart?: boolean;
  searchSlot?: ReactNode;
};

export default function ArchiveHeader({
  title,
  subtitle,
  showCart = false,
  searchSlot,
}: ArchiveHeaderProps) {
  return (
    <div className={styles.header}>
      <div className={styles.textContent}>
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
      <div className={styles.rightContent}>
        {searchSlot ?? <SearchInput />}
        {showCart && (
          <div className={styles.cartWrapper}>
            <CartBadge />
          </div>
        )}
      </div>
    </div>
  );
}
