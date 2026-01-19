import Image from "next/image";
import { ArrowRight, Ban } from "lucide-react";
import type { Practitioner } from "@/lib/graphql/queries/locations";
import styles from "./PractitionerCard.module.css";
import { Button, ImageWrapper, Text } from "@/components/Primitives";

type PractitionerCardProps = {
  practitioner: Practitioner;
};

export function PractitionerCard({ practitioner }: PractitionerCardProps) {
  // Get discipline label from taxonomy
  const discipline = practitioner.disciplines?.nodes?.[0];
  const disciplineLabel = discipline?.name || "Practitioner";

  const roleLabel = practitioner.jobTitle || disciplineLabel;

  const nameParts = practitioner.title?.split(" ") ?? [];
  const prefixes = ["Dr.", "Dr", "Mr.", "Mr", "Ms.", "Ms", "Mrs.", "Mrs"];
  const firstName = prefixes.includes(nameParts[0])
    ? nameParts[1]
    : nameParts[0];

  const bookCta = firstName
    ? `Book with ${firstName}`
    : "Book with this practitioner";

  const formattedRole = practitioner.credentials
    ? `${practitioner.credentials} • ${roleLabel.toUpperCase()}`
    : roleLabel.toUpperCase();

  return (
    <div className={styles.card}>
      <ImageWrapper className={styles.imageWrapper}>
        {practitioner.headshot?.sourceUrl ? (
          <Image
            src={practitioner.headshot.sourceUrl}
            alt={
              practitioner.headshot.altText ||
              practitioner.title ||
              "Practitioner photo"
            }
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
        {practitioner.acceptingPatients && (
          <Text as="span" className={styles.badge}>Accepting Patients</Text>
        )}
      </ImageWrapper>

      <div className={styles.content}>
        <Text as="h3" className={styles.name}>{practitioner.title}</Text>
        <Text className={styles.role}>{formattedRole}</Text>

        {practitioner.specialties?.nodes &&
          practitioner.specialties.nodes.length > 0 && (
            <div className={styles.specialties}>
              {practitioner.specialties.nodes.map((specialty) => (
                <Text as="span" key={specialty.slug} className={styles.specialty}>
                  {specialty.name}
                </Text>
              ))}
            </div>
          )}

        {practitioner.bio && (
          <div
            className={styles.bio}
            dangerouslySetInnerHTML={{ __html: practitioner.bio }}
          />
        )}

        <div className={styles.actions}>
          <Button
            as="a"
            href="#book"
            icon={<ArrowRight size={18} />}
            variant="inverse"
            outline
            fullWidth
            iconPosition="right"
          >
            {bookCta}
          </Button>
        </div>
      </div>
    </div>
  );
}
