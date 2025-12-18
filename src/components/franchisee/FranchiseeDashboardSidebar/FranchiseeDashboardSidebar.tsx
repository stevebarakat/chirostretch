"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import styles from "./FranchiseeDashboardSidebar.module.css";

type NavItem = {
  href: string;
  label: string;
};

const navItems: NavItem[] = [
  { href: "/my-account/franchisee", label: "Dashboard" },
  { href: "/my-account/franchisee/location", label: "Clinic" },
  { href: "/my-account/franchisee/staff", label: "Staff" },
  { href: "/my-account/franchisee/profile", label: "My Profile" },
  { href: "/my-account/logout", label: "Log out" },
];

export function FranchiseeDashboardSidebar() {
  const pathname = usePathname();

  return (
    <nav className={styles.sidebar}>
      <ul className={styles.navList}>
        {navItems.map((item) => {
          const isActive =
            item.href === "/my-account/franchisee"
              ? pathname === item.href
              : pathname.startsWith(item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={clsx(
                  styles.navLink,
                  isActive && styles.navLinkActive
                )}
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
