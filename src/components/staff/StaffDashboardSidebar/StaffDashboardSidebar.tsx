"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./StaffDashboardSidebar.module.css";

type NavItem = {
  href: string;
  label: string;
};

const navItems: NavItem[] = [
  { href: "/my-account/staff", label: "Dashboard" },
  { href: "/my-account/staff/profile", label: "My Profile" },
  { href: "/my-account/logout", label: "Log out" },
];

export function StaffDashboardSidebar() {
  const pathname = usePathname();

  return (
    <nav className={styles.sidebar}>
      <ul className={styles.navList}>
        {navItems.map((item) => {
          const isActive =
            item.href === "/my-account/staff"
              ? pathname === item.href
              : pathname.startsWith(item.href);
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
