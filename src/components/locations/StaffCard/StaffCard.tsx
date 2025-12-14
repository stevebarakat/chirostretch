import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { ClinicalStaff } from "@/lib/graphql/queries/locations";
import Button from "@/components/ui/Button";
import styles from "./StaffCard.module.css";

type StaffCardProps = {
  staff: ClinicalStaff;
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
    deep_tissue: "Deep Tissue",
    swedish: "Swedish Massage",
    trigger_point: "Trigger Point Therapy",
    myofascial: "Myofascial Release",
    rehab: "Rehabilitation",
    flexibility: "Flexibility Training",
  };

  const staffTypeLabels: Record<string, string> = {
    chiropractor: "Chiropractor",
    massage_therapist: "Massage Therapist",
    physical_therapist: "Physical Therapist",
    stretch_therapist: "Stretch Therapist",
    acupuncturist: "Acupuncturist",
  };

  const roleLabel =
    staff.jobTitle || staffTypeLabels[staff.staffType || ""] || "Staff";

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
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <h3 className={styles.name}>{staff.title}</h3>

            <p className={styles.role}>
              {roleLabel}
              {staff.credentials && ` · ${staff.credentials}`}
            </p>
          </div>

          {staff.acceptingPatients && (
            <span className={styles.badge}>Accepting Patients</span>
          )}
        </div>

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

        <div className={styles.actions}>
          <Button
            as="a"
            href="#"
            variant="primary"
            icon={<ArrowRight size={18} />}
          >
            Book Appointment
          </Button>
        </div>
      </div>
    </div>
  );
}
