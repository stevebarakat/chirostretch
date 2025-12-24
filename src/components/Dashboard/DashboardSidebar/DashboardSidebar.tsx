"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import styles from "./DashboardSidebar.module.css";

type NavItem = {
  href: string;
  label: string;
};

type NavSection = {
  title?: string;
  items: NavItem[];
};

type DashboardSidebarProps = {
  userRole: string | null;
  hasOrders?: boolean;
};

function getNavSections(
  userRole: string | null,
  hasOrders: boolean
): NavSection[] {
  const sections: NavSection[] = [];

  // Shared section - all authenticated users
  const sharedItems: NavItem[] = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/profile", label: "Profile" },
    { href: "/addresses", label: "Addresses" },
    { href: "/payment-methods", label: "Payment Methods" },
  ];
  sections.push({ items: sharedItems });

  // Customer section - visible if user has orders or is a customer
  if (hasOrders || userRole === "customer") {
    const customerItems: NavItem[] = [
      { href: "/orders", label: "Orders" },
      { href: "/downloads", label: "Downloads" },
    ];
    sections.push({ title: "Purchases", items: customerItems });
  }

  // Role-specific sections
  if (userRole === "franchisee") {
    const franchiseeItems: NavItem[] = [
      { href: "/franchisee", label: "Overview" },
      { href: "/franchisee/location", label: "Location" },
      { href: "/franchisee/staff", label: "Staff" },
    ];
    sections.push({ title: "Franchise", items: franchiseeItems });
  }

  if (userRole === "staff") {
    const staffItems: NavItem[] = [
      { href: "/staff", label: "Overview" },
      { href: "/staff/profile", label: "Staff Profile" },
    ];
    sections.push({ title: "Staff", items: staffItems });
  }

  if (userRole === "franchise_applicant") {
    const applicantItems: NavItem[] = [
      { href: "/application", label: "Application Status" },
    ];
    sections.push({ title: "Application", items: applicantItems });
  }

  if (userRole === "lead") {
    const leadItems: NavItem[] = [
      { href: "/book", label: "Book Appointment" },
    ];
    sections.push({ title: "Your Offer", items: leadItems });
  }

  // Logout at the end
  sections.push({
    items: [{ href: "/logout", label: "Log out" }],
  });

  return sections;
}

export function DashboardSidebar({ userRole, hasOrders = false }: DashboardSidebarProps) {
  const pathname = usePathname();
  const sections = getNavSections(userRole, hasOrders);

  return (
    <nav className={styles.sidebar}>
      {sections.map((section, sectionIndex) => (
        <div key={sectionIndex} className={styles.section}>
          {section.title && (
            <h3 className={styles.sectionTitle}>{section.title}</h3>
          )}
          <ul className={styles.navList}>
            {section.items.map((item) => {
              const isActive =
                item.href === "/dashboard"
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
        </div>
      ))}
    </nav>
  );
}
