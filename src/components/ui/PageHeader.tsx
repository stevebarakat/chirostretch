"use client";

import SearchInput from "@/components/layout/SearchInput";
import CartSummary from "@/components/layout/CartSummary";
import styles from "./PageHeader.module.css";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  showCart?: boolean;
};

export default function PageHeader({ title, subtitle, showCart = false }: PageHeaderProps) {
  return (
    <div className={styles.header}>
      <div className={styles.textContent}>
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
      <div className={styles.rightContent}>
        <SearchInput />
        {showCart && (
          <div className={styles.cartWrapper}>
            <CartSummary />
          </div>
        )}
      </div>
    </div>
  );
}
