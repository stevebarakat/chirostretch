"use client";

import { ReactNode } from "react";
import SearchInput from "@/components/Layout/SearchInput";
import CartSummary from "@/components/Layout/CartSummary";
import styles from "./PageHeader.module.css";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  showCart?: boolean;
  searchSlot?: ReactNode;
};

export default function PageHeader({
  title,
  subtitle,
  showCart = false,
  searchSlot,
}: PageHeaderProps) {
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
            <CartSummary />
          </div>
        )}
      </div>
    </div>
  );
}
