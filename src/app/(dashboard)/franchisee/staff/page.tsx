import Link from "next/link";
import Image from "next/image";
import {
  getViewerFranchiseLocation,
  STAFF_TYPE_LABELS,
} from "@/lib/graphql/queries/franchisee";
import { StaffActions } from "./StaffActions";
import styles from "./page.module.css";

export const metadata = {
  title: "Staff Management - ChiroStretch",
  description: "Manage your franchise staff members",
};

export default async function FranchiseeStaffPage() {
  const viewer = await getViewerFranchiseLocation();

  if (!viewer) {
    return (
      <div className={styles.errorState}>
        <h2>Unable to Load Staff</h2>
        <p>Please try logging in again or contact support.</p>
      </div>
    );
  }

  const location = viewer.franchiseLocation;

  if (!location) {
    return (
      <div className={styles.errorState}>
        <h2>No Location Assigned</h2>
        <p>
          Your franchise location has not been set up yet. Please contact
          support for assistance.
        </p>
      </div>
    );
  }

  const staff = location.staff?.nodes || [];

  return (
    <>
      <div className={styles.header}>
        <div className={styles.headerInfo}>
          <h1 className={styles.title}>Staff Management</h1>
          <h2 className={styles.subtitle}>{location.title}</h2>
          <p className={styles.staffCount}>
            {staff.length} {staff.length === 1 ? "staff member" : "staff members"}
          </p>
        </div>
        <Link href="/franchisee/staff/new" className={styles.addButton}>
          + Add Staff Member
        </Link>
      </div>

      {staff.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No staff members yet.</p>
          <p>Add your first staff member to get started.</p>
        </div>
      ) : (
        <div className={styles.staffList}>
          {staff.map((member) => (
            <div key={member.databaseId} className={styles.staffCard}>
              <div className={styles.staffInfo}>
                {member.headshot ? (
                  <Image
                    src={member.headshot.sourceUrl}
                    alt={member.headshot.altText || member.title}
                    width={60}
                    height={60}
                    className={styles.avatar}
                  />
                ) : (
                  <div className={styles.avatarPlaceholder}>
                    {member.title.charAt(0)}
                  </div>
                )}
                <div className={styles.staffDetails}>
                  <h3 className={styles.staffName}>{member.title}</h3>
                  <p className={styles.staffRole}>
                    {STAFF_TYPE_LABELS[member.staffType] || member.staffType}
                    {member.jobTitle && ` - ${member.jobTitle}`}
                  </p>
                  {member.email && (
                    <p className={styles.staffEmail}>{member.email}</p>
                  )}
                </div>
              </div>
              <div className={styles.staffMeta}>
                <div className={styles.badges}>
                  <span
                    className={`${styles.badge} ${
                      member.isPublic ? styles.badgeActive : styles.badgeInactive
                    }`}
                  >
                    {member.isPublic ? "Public" : "Hidden"}
                  </span>
                  {member.acceptingPatients !== undefined && (
                    <span
                      className={`${styles.badge} ${
                        member.acceptingPatients
                          ? styles.badgeActive
                          : styles.badgeInactive
                      }`}
                    >
                      {member.acceptingPatients
                        ? "Accepting"
                        : "Not Accepting"}
                    </span>
                  )}
                </div>
                <StaffActions staffId={member.databaseId} staffName={member.title} />
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
