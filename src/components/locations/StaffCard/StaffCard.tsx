import Image from "next/image";
import type { Chiropractor } from "@/lib/graphql/queries/locations";
import styles from "./StaffCard.module.css";

type StaffCardProps = {
  staff: Chiropractor;
};

export function StaffCard({ staff }: StaffCardProps) {
  const specialtyLabels: Record<string, string> = {
    sports_injuries: "Sports Injuries",
    back_pain: "Back Pain",
    neck_pain: "Neck Pain",
    headaches: "Headaches & Migraines",
    posture_correction: "Posture Correction",
    prenatal: "Prenatal Care",
    pediatric: "Pediatric",
    wellness: "Wellness & Prevention",
  };

  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        {staff.headshot?.sourceUrl ? (
          <Image
            src={staff.headshot.sourceUrl}
            alt={staff.headshot.altText || staff.title || "Staff photo"}
            width={200}
            height={200}
            className={styles.image}
          />
        ) : (
          <div className={styles.placeholder}>
            <span className={styles.placeholderIcon}>👤</span>
          </div>
        )}
      </div>

      <div className={styles.content}>
        <h3 className={styles.name}>
          {staff.title}
          {staff.credentials && (
            <span className={styles.credentials}>, {staff.credentials}</span>
          )}
        </h3>

        {staff.jobTitle && (
          <p className={styles.jobTitle}>{staff.jobTitle}</p>
        )}

        {staff.specialties && staff.specialties.length > 0 && (
          <div className={styles.specialties}>
            {staff.specialties.map((specialty) => (
              <span key={specialty} className={styles.specialty}>
                {specialtyLabels[specialty] || specialty}
              </span>
            ))}
          </div>
        )}

        {staff.bio && (
          <div
            className={styles.bio}
            dangerouslySetInnerHTML={{ __html: staff.bio }}
          />
        )}

        {staff.acceptingPatients !== undefined && (
          <p className={styles.accepting}>
            {staff.acceptingPatients ? (
              <span className={styles.acceptingYes}>Accepting new patients</span>
            ) : (
              <span className={styles.acceptingNo}>Not accepting new patients</span>
            )}
          </p>
        )}
      </div>
    </div>
  );
}
