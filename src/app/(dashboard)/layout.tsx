import { redirect } from "next/navigation";
import { isAuthenticated, getUserRole } from "@/lib/auth";
import { DashboardSidebar } from "@/components/Dashboard";
import styles from "./layout.module.css";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authenticated = await isAuthenticated();

  if (!authenticated) {
    redirect("/login?redirect=/dashboard");
  }

  const userRole = await getUserRole();

  // TODO: Check if user has orders to show customer links
  const hasOrders = false;

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.layout}>
          <aside className={styles.sidebar}>
            <DashboardSidebar userRole={userRole} hasOrders={hasOrders} />
          </aside>
          <main className={styles.content}>{children}</main>
        </div>
      </div>
    </div>
  );
}
