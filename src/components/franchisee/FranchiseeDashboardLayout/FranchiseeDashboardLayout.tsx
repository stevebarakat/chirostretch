import type { ReactNode } from "react";
import { FranchiseeDashboardSidebar } from "../FranchiseeDashboardSidebar";
import styles from "./FranchiseeDashboardLayout.module.css";

type FranchiseeDashboardLayoutProps = {
  children: ReactNode;
  title?: string;
};

export function FranchiseeDashboardLayout({
  children,
  title,
}: FranchiseeDashboardLayoutProps) {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {title && <h1 className={styles.title}>{title}</h1>}
        <div className={styles.layout}>
          <aside className={styles.sidebar}>
            <FranchiseeDashboardSidebar />
          </aside>
          <main className={styles.content}>{children}</main>
        </div>
      </div>
    </div>
  );
}
