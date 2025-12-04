"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./DashboardSidebar.module.css";

type NavItem = {
  href: string;
  label: string;
};

const navItems: NavItem[] = [
  { href: "/my-account", label: "Dashboard" },
  { href: "/my-account/orders", label: "Orders" },
  { href: "/my-account/downloads", label: "Downloads" },
  { href: "/my-account/addresses", label: "Addresses" },
  { href: "/my-account/payment-methods", label: "Payment methods" },
  { href: "/my-account/account-details", label: "Account details" },
  { href: "/my-account/logout", label: "Log out" },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <nav className={styles.sidebar}>
      <ul className={styles.navList}>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`${styles.navLink} ${
                  isActive ? styles.navLinkActive : ""
                }`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
