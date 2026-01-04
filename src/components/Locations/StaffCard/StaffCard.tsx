import Image from "next/image";
import { ArrowRight, Ban } from "lucide-react";
import type { ClinicalStaff } from "@/lib/graphql/queries/locations";
import styles from "./StaffCard.module.css";
import { Button } from "@/components/UI";
import { ImageWrapper } from "@/components/UI";

type StaffCardProps = {
  staff: ClinicalStaff;
};

export function StaffCard({ staff }: StaffCardProps) {
  // Get discipline label from taxonomy
  const discipline = staff.disciplines?.nodes?.[0];
  const disciplineLabel = discipline?.name || "Staff";

  const roleLabel = staff.jobTitle || disciplineLabel;

  const nameParts = staff.title?.split(" ") ?? [];
  const prefixes = ["Dr.", "Dr", "Mr.", "Mr", "Ms.", "Ms", "Mrs.", "Mrs"];
  const firstName = prefixes.includes(nameParts[0])
    ? nameParts[1]
    : nameParts[0];

  const staffCta = firstName
    ? `Book with ${firstName}`
    : "Book with this therapist";

  const formattedRole = staff.credentials
    ? `${staff.credentials} • ${roleLabel.toUpperCase()}`
    : roleLabel.toUpperCase();

  return (
    <div className={styles.card}>
      <ImageWrapper className={styles.imageWrapper}>
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
      </ImageWrapper>

      <div className={styles.content}>
        <h3 className={styles.name}>{staff.title}</h3>
        <p className={styles.role}>{formattedRole}</p>

        {staff.specialties?.nodes && staff.specialties.nodes.length > 0 && (
          <div className={styles.specialties}>
            {staff.specialties.nodes.map((specialty) => (
              <span key={specialty.slug} className={styles.specialty}>
                {specialty.name}
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
