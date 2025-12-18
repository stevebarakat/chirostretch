import Image from "next/image";
import { ArrowRight, Ban } from "lucide-react";
import type { ClinicalStaff } from "@/lib/graphql/queries/locations";
import styles from "./StaffCard.module.css";
import Button from "@/components/ui/Button";

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

  const firstName = staff.title?.split(" ")[0];

  const staffCta = firstName
    ? `Book with ${firstName}`
    : "Book with this therapist";

  const formattedRole = staff.credentials
    ? `${staff.credentials} • ${roleLabel.toUpperCase()}`
    : roleLabel.toUpperCase();

  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        {staff.headshot?.sourceUrl ? (
          <Image
            src={staff.headshot.sourceUrl}
            alt={staff.headshot.altText || staff.title || "Staff photo"}
            fill
            sizes="(max-width: 640px) 100vw, 400px"
            className={styles.image}
          />
        ) : (
          <div className={styles.placeholder}>
            <Ban className={styles.placeholderIcon} strokeWidth={1} />
            <span className={styles.placeholderText}>No image</span>
          </div>
        )}
        {staff.acceptingPatients && (
          <span className={styles.badge}>Accepting Patients</span>
        )}
      </div>

      <div className={styles.content}>
        <h3 className={styles.name}>{staff.title}</h3>
        <p className={styles.role}>{formattedRole}</p>

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
            icon={<ArrowRight size={18} />}
            variant="inverse"
            outline
            fullWidth
            iconPosition="right"
          >
            {staffCta}
          </Button>
        </div>
      </div>
    </div>
  );
}
