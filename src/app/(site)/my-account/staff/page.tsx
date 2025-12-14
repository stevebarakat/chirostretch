import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { StaffDashboardLayout } from "@/components/staff";
import { getViewerStaffProfile } from "@/lib/staff/account";
import { isAuthenticated } from "@/lib/auth";
import { STAFF_TYPE_LABELS } from "@/lib/graphql/queries/staff";
import styles from "./page.module.css";

export const metadata = {
  title: "Staff Dashboard - ChiroStretch",
  description: "Manage your staff profile and view your location details",
};

export default async function StaffDashboardPage() {
  const authenticated = await isAuthenticated();

  if (!authenticated) {
    redirect("/login?redirect=/my-account/staff");
  }

  const profile = await getViewerStaffProfile();

  if (!profile) {
    return (
      <StaffDashboardLayout title="Staff Dashboard">
        <div className={styles.errorState}>
          <h2>No Staff Profile Found</h2>
          <p>
            Your account is not linked to a staff profile. Please contact an
            administrator.
          </p>
        </div>
      </StaffDashboardLayout>
    );
  }

  const staffTypeLabel = STAFF_TYPE_LABELS[profile.staffType] || profile.staffType;

  return (
    <StaffDashboardLayout title="Staff Dashboard">
      <div className={styles.welcome}>
        <h2 className={styles.welcomeTitle}>
          Welcome, {profile.title}
        </h2>
        <p className={styles.welcomeSubtitle}>
          {staffTypeLabel}
          {profile.jobTitle && ` - ${profile.jobTitle}`}
        </p>
      </div>

      <div className={styles.grid}>
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>My Profile</h3>
          <div className={styles.profilePreview}>
            {profile.headshot ? (
              <Image
                src={profile.headshot.sourceUrl}
                alt={profile.headshot.altText || profile.title}
                width={80}
                height={80}
                className={styles.avatar}
              />
            ) : (
              <div className={styles.avatarPlaceholder}>
                {profile.title.charAt(0)}
              </div>
            )}
            <div className={styles.profileInfo}>
              <p className={styles.profileName}>{profile.title}</p>
              {profile.credentials && (
                <p className={styles.credentials}>{profile.credentials}</p>
              )}
            </div>
          </div>
          <Link href="/my-account/staff/profile" className={styles.cardLink}>
            Edit Profile
          </Link>
        </div>

        {profile.assignedLocation && (
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>My Location</h3>
            <div className={styles.locationInfo}>
              <p className={styles.locationName}>
                {profile.assignedLocation.title}
              </p>
              {profile.assignedLocation.streetAddress && (
                <p className={styles.locationAddress}>
                  {profile.assignedLocation.streetAddress}
                  <br />
                  {profile.assignedLocation.city},{" "}
                  {profile.assignedLocation.state}{" "}
                  {profile.assignedLocation.zip}
                </p>
              )}
              {profile.assignedLocation.phone && (
                <p className={styles.locationPhone}>
                  {profile.assignedLocation.phone}
                </p>
              )}
            </div>
            <Link
              href={`/locations/${profile.assignedLocation.slug}`}
              className={styles.cardLink}
              target="_blank"
            >
              View Location Page
            </Link>
          </div>
        )}

        {profile.servicesOffered.length > 0 && (
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Services I Offer</h3>
            <ul className={styles.servicesList}>
              {profile.servicesOffered.map((service) => (
                <li key={service} className={styles.serviceItem}>
                  {service}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Status</h3>
          <div className={styles.statusList}>
            <div className={styles.statusItem}>
              <span className={styles.statusLabel}>Accepting Patients</span>
              <span
                className={`${styles.statusBadge} ${
                  profile.acceptingPatients
                    ? styles.statusActive
                    : styles.statusInactive
                }`}
              >
                {profile.acceptingPatients ? "Yes" : "No"}
              </span>
            </div>
            <div className={styles.statusItem}>
              <span className={styles.statusLabel}>Visible on Website</span>
              <span
                className={`${styles.statusBadge} ${
                  profile.isPublic ? styles.statusActive : styles.statusInactive
                }`}
              >
                {profile.isPublic ? "Yes" : "No"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </StaffDashboardLayout>
  );
}
