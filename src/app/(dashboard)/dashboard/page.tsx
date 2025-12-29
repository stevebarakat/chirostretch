import Link from "next/link";
import { getUserRole } from "@/lib/auth";
import { getViewerAccount } from "@/lib/woocommerce/account";

export const metadata = {
  title: "Dashboard - ChiroStretch",
  description: "Your ChiroStretch account dashboard",
};

export default async function DashboardPage() {
  const [data, userRole] = await Promise.all([
    getViewerAccount(),
    getUserRole(),
  ]);

  const firstName =
    data?.customer?.firstName ?? data?.viewer?.firstName ?? "there";

  return (
    <>
      <h1 style={{ marginBottom: "0.5rem" }}>Welcome, {firstName}</h1>
      <p style={{ color: "var(--color-text-secondary)", marginBottom: "2rem" }}>
        Manage your account, orders, and settings from your dashboard.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "1.5rem",
        }}
      >
        <DashboardCard
          title="Profile"
          description="Update your personal information and password"
          href="/profile"
        />
        <DashboardCard
          title="Addresses"
          description="Manage your billing and shipping addresses"
          href="/addresses"
        />
        <DashboardCard
          title="Payment Methods"
          description="View and manage your saved payment methods"
          href="/payment-methods"
        />
        <DashboardCard
          title="Orders"
          description="View your order history and track shipments"
          href="/orders"
        />

        {userRole === "franchisee" && (
          <DashboardCard
            title="Franchise Dashboard"
            description="Manage your location and staff"
            href="/franchisee"
            highlight
          />
        )}

        {userRole === "staff" && (
          <DashboardCard
            title="Staff Dashboard"
            description="View your profile and location details"
            href="/staff"
            highlight
          />
        )}

        {userRole === "franchise_applicant" && (
          <DashboardCard
            title="Application Status"
            description="Check your franchise application status"
            href="/application"
            highlight
          />
        )}
      </div>
    </>
  );
}

function DashboardCard({
  title,
  description,
  href,
  highlight = false,
}: {
  title: string;
  description: string;
  href: string;
  highlight?: boolean;
}) {
  return (
    <Link
      href={href}
      style={{
        display: "block",
        padding: "1.5rem",
        background: highlight
          ? "var(--color-primary-50)"
          : "var(--color-neutral-50)",
        borderRadius: "var(--radius-md)",
        textDecoration: "none",
        color: "inherit",
        border: highlight
          ? "1px solid var(--color-primary-200)"
          : "1px solid transparent",
        transition: "all 0.2s",
      }}
    >
      <h3
        style={{
          fontSize: "1.125rem",
          fontWeight: 600,
          marginBottom: "0.5rem",
          color: highlight
            ? "var(--color-primary-700)"
            : "var(--color-text-primary)",
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontSize: "0.875rem",
          color: "var(--color-text-secondary)",
          margin: 0,
        }}
      >
        {description}
      </p>
    </Link>
  );
}
