import type { ReactNode } from "react";
import { DashboardSidebar } from "../DashboardSidebar";
import styles from "./DashboardLayout.module.css";

type DashboardLayoutProps = {
  children: ReactNode;
  title?: string;
};

export function DashboardLayout({ children, title }: DashboardLayoutProps) {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {title && <h1 className={styles.title}>{title}</h1>}
        <div className={styles.layout}>
          <aside className={styles.sidebar}>
            <DashboardSidebar />
          </aside>
          <main className={styles.content}>{children}</main>
        </div>
      </div>
    </div>
  );
}
