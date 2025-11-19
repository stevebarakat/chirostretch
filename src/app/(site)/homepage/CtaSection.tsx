import Image from "next/image";
import Button from "@/components/ui/Button";
import styles from "./CtaSection.module.css";

type CtaSectionProps = {
  ctaBackgroundImage?: {
    sourceUrl?: string;
    altText?: string;
  };
  ctaHeading?: string;
  ctaDescription?: string;
  ctaButtonText?: string;
  ctaButtonLink?: string;
};

export default function CtaSection({
  ctaBackgroundImage,
  ctaHeading,
  ctaDescription,
  ctaButtonText,
  ctaButtonLink,
}: CtaSectionProps) {
  if (!ctaHeading) return null;

  return (
    <section className={styles.section}>
      {ctaBackgroundImage?.sourceUrl && (
        <div className={styles.imageWrapper}>
        <Image
          src={ctaBackgroundImage.sourceUrl}
          alt={ctaBackgroundImage.altText || ""}
            fill
            className={styles.image}
          unoptimized
        />
        </div>
      )}
      <div className={styles.overlay} />
      <div className={styles.content}>
        {ctaHeading && <h2 className={styles.heading}>{ctaHeading}</h2>}
        {ctaDescription && (
          <p className={styles.description}>{ctaDescription}</p>
        )}
      {ctaButtonText && ctaButtonLink && (
          <Button as="a" href={ctaButtonLink} variant="primary">
            {ctaButtonText}
          </Button>
      )}
      </div>
    </section>
  );
}

