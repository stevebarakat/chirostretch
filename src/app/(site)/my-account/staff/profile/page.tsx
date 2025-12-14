import { redirect } from "next/navigation";
import Image from "next/image";
import { StaffDashboardLayout } from "@/components/staff";
import { getViewerStaffProfile } from "@/lib/staff/account";
import { isAuthenticated } from "@/lib/auth";
import { STAFF_TYPE_LABELS } from "@/lib/graphql/queries/staff";
import styles from "./page.module.css";

export const metadata = {
  title: "My Profile - Staff Dashboard - ChiroStretch",
  description: "View and manage your staff profile",
};

export default async function StaffProfilePage() {
  const authenticated = await isAuthenticated();

  if (!authenticated) {
    redirect("/login?redirect=/my-account/staff/profile");
  }

  const profile = await getViewerStaffProfile();

  if (!profile) {
    return (
      <StaffDashboardLayout title="My Profile">
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

  const staffTypeLabel =
    STAFF_TYPE_LABELS[profile.staffType] || profile.staffType;

  return (
    <StaffDashboardLayout title="My Profile">
      <div className={styles.profileHeader}>
        {profile.headshot ? (
          <Image
            src={profile.headshot.sourceUrl}
            alt={profile.headshot.altText || profile.title}
            width={120}
            height={120}
            className={styles.avatar}
          />
        ) : (
          <div className={styles.avatarPlaceholder}>
            {profile.title.charAt(0)}
          </div>
        )}
        <div className={styles.headerInfo}>
          <h2 className={styles.name}>{profile.title}</h2>
          <p className={styles.role}>
            {staffTypeLabel}
            {profile.jobTitle && ` - ${profile.jobTitle}`}
          </p>
          {profile.credentials && (
            <p className={styles.credentials}>{profile.credentials}</p>
          )}
        </div>
      </div>

      <div className={styles.sections}>
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Biography</h3>
          {profile.bio ? (
            <div
              className={styles.bio}
              dangerouslySetInnerHTML={{ __html: profile.bio }}
            />
          ) : (
            <p className={styles.emptyText}>No biography added yet.</p>
          )}
        </section>

        {profile.specialties.length > 0 && (
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Specialties</h3>
            <ul className={styles.tagList}>
              {profile.specialties.map((specialty) => (
                <li key={specialty} className={styles.tag}>
                  {formatSpecialty(specialty)}
                </li>
              ))}
            </ul>
          </section>
        )}

        {profile.servicesOffered.length > 0 && (
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Services Offered</h3>
            <ul className={styles.tagList}>
              {profile.servicesOffered.map((service) => (
                <li key={service} className={styles.tagService}>
                  {service}
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Status</h3>
          <div className={styles.statusGrid}>
            <div className={styles.statusItem}>
              <span className={styles.statusLabel}>Accepting New Patients</span>
              <span
                className={`${styles.statusValue} ${
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
                className={`${styles.statusValue} ${
                  profile.isPublic ? styles.statusActive : styles.statusInactive
                }`}
              >
                {profile.isPublic ? "Yes" : "No"}
              </span>
            </div>
          </div>
        </section>

        {profile.assignedLocation && (
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Assigned Location</h3>
            <div className={styles.locationCard}>
              <p className={styles.locationName}>
                {profile.assignedLocation.title}
              </p>
              {profile.assignedLocation.address && (
                <p className={styles.locationAddress}>
                  {profile.assignedLocation.address.street}
                  <br />
                  {profile.assignedLocation.address.city},{" "}
                  {profile.assignedLocation.address.state}{" "}
                  {profile.assignedLocation.address.zipCode}
                </p>
              )}
              {profile.assignedLocation.phone && (
                <p className={styles.locationContact}>
                  Phone: {profile.assignedLocation.phone}
                </p>
              )}
              {profile.assignedLocation.email && (
                <p className={styles.locationContact}>
                  Email: {profile.assignedLocation.email}
                </p>
              )}
            </div>
          </section>
        )}

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Need to Make Changes?</h3>
          <p className={styles.helpText}>
            To update your profile information, credentials, or location
            assignment, please contact your location administrator or the
            ChiroStretch support team.
          </p>
        </section>
      </div>
    </StaffDashboardLayout>
  );
}

function formatSpecialty(specialty: string): string {
  const labels: Record<string, string> = {
    sports_injuries: "Sports Injuries",
    back_pain: "Back Pain",
    neck_pain: "Neck Pain",
    headaches: "Headaches & Migraines",
    posture_correction: "Posture Correction",
    prenatal: "Prenatal Care",
    pediatric: "Pediatric",
    wellness: "Wellness & Prevention",
    deep_tissue: "Deep Tissue",
    swedish: "Swedish Massage",
    trigger_point: "Trigger Point Therapy",
    myofascial: "Myofascial Release",
    rehab: "Rehabilitation",
    flexibility: "Flexibility Training",
  };
  return labels[specialty] || specialty;
}
