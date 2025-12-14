import type { ReactNode } from "react";
import { StaffDashboardSidebar } from "../StaffDashboardSidebar";
import styles from "./StaffDashboardLayout.module.css";

type StaffDashboardLayoutProps = {
  children: ReactNode;
  title?: string;
};

export function StaffDashboardLayout({
  children,
  title,
}: StaffDashboardLayoutProps) {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {title && <h1 className={styles.title}>{title}</h1>}
        <div className={styles.layout}>
          <aside className={styles.sidebar}>
            <StaffDashboardSidebar />
          </aside>
          <main className={styles.content}>{children}</main>
        </div>
      </div>
    </div>
  );
}
