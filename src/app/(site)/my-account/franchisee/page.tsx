import { redirect } from "next/navigation";
import Link from "next/link";
import { isAuthenticated } from "@/lib/auth";
import { FranchiseeDashboardLayout } from "@/components/franchisee";
import {
  getViewerFranchiseLocation,
  STAFF_TYPE_LABELS,
} from "@/lib/graphql/queries/franchisee";
import styles from "./page.module.css";

export const metadata = {
  title: "Franchisee Dashboard - ChiroStretch",
  description: "Manage your franchise location and staff",
};

export default async function FranchiseeDashboardPage() {
  const authenticated = await isAuthenticated();

  if (!authenticated) {
    redirect("/login?redirect=/my-account/franchisee");
  }

  const viewer = await getViewerFranchiseLocation();

  if (!viewer) {
    return (
      <FranchiseeDashboardLayout title="Franchisee Dashboard">
        <div className={styles.errorState}>
          <h2>Unable to Load Dashboard</h2>
          <p>Please try logging in again or contact support.</p>
        </div>
      </FranchiseeDashboardLayout>
    );
  }

  const location = viewer.franchiseLocation;

  if (!location) {
    return (
      <FranchiseeDashboardLayout title="Franchisee Dashboard">
        <div className={styles.errorState}>
          <h2>No Location Assigned</h2>
          <p>
            Your franchise location has not been set up yet. Please contact
            support for assistance.
          </p>
        </div>
      </FranchiseeDashboardLayout>
    );
  }

  const staffCount = location.staff?.nodes?.length || 0;
  const publicStaffCount =
    location.staff?.nodes?.filter((s) => s.isPublic).length || 0;

  return (
    <FranchiseeDashboardLayout title="Franchisee Dashboard">
      <div className={styles.welcome}>
        <h2 className={styles.welcomeTitle}>
          Welcome, {viewer.firstName || "Franchisee"}
        </h2>
        <p className={styles.welcomeSubtitle}>{location.title}</p>
      </div>

      <div className={styles.grid}>
        <Link href="/my-account/franchisee/location" className={styles.card}>
          <h3 className={styles.cardTitle}>My Location</h3>
          <div className={styles.cardContent}>
            <p className={styles.locationName}>{location.title}</p>
            {location.streetAddress && (
              <p className={styles.locationAddress}>
                {location.streetAddress}
                <br />
                {location.city}, {location.state} {location.zip}
              </p>
            )}
          </div>
          <span className={styles.cardAction}>View &amp; Edit</span>
        </Link>

        <Link href="/my-account/franchisee/staff" className={styles.card}>
          <h3 className={styles.cardTitle}>Staff Members</h3>
          <div className={styles.cardContent}>
            <div className={styles.statGrid}>
              <div className={styles.stat}>
                <span className={styles.statNumber}>{staffCount}</span>
                <span className={styles.statLabel}>Total Staff</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>{publicStaffCount}</span>
                <span className={styles.statLabel}>Public Profiles</span>
              </div>
            </div>
          </div>
          <span className={styles.cardAction}>Manage Staff</span>
        </Link>

        {location.servicesOffered && location.servicesOffered.length > 0 && (
          <div className={styles.cardWide}>
            <h3 className={styles.cardTitle}>Services Offered</h3>
            <div className={styles.servicesList}>
              {location.servicesOffered.map((service) => (
                <span key={service} className={styles.serviceTag}>
                  {service}
                </span>
              ))}
            </div>
            <p className={styles.servicesNote}>
              Services are determined by your staff members&apos; specialties.
            </p>
          </div>
        )}

        {staffCount > 0 && (
          <div className={styles.cardWide}>
            <h3 className={styles.cardTitle}>Staff Overview</h3>
            <div className={styles.staffList}>
              {location.staff.nodes.slice(0, 5).map((staff) => (
                <div key={staff.databaseId} className={styles.staffItem}>
                  <div className={styles.staffInfo}>
                    <span className={styles.staffName}>{staff.title}</span>
                    <span className={styles.staffRole}>
                      {STAFF_TYPE_LABELS[staff.staffType] || staff.staffType}
                    </span>
                  </div>
                  <span
                    className={`${styles.statusBadge} ${
                      staff.isPublic ? styles.statusActive : styles.statusInactive
                    }`}
                  >
                    {staff.isPublic ? "Public" : "Hidden"}
                  </span>
                </div>
              ))}
              {staffCount > 5 && (
                <Link
                  href="/my-account/franchisee/staff"
                  className={styles.viewAllLink}
                >
                  View all {staffCount} staff members
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </FranchiseeDashboardLayout>
  );
}
