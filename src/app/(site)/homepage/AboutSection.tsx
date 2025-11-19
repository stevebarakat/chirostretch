import Image from "next/image";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import styles from "./AboutSection.module.css";

type AcfLink = {
  url?: string;
  title?: string;
  target?: string;
};

type AboutSectionProps = {
  aboutHeading?: string;
  aboutSubheading?: string;
  aboutImage?: {
    sourceUrl?: string;
    altText?: string;
  };
  aboutCtaText?: string;
  aboutCtaLink?: AcfLink;
};

export default function AboutSection({
  aboutHeading,
  aboutSubheading,
  aboutImage,
  aboutCtaText,
  aboutCtaLink,
}: AboutSectionProps) {
  if (!aboutHeading) return null;

  return (
    <section className={styles.section}>
      <Container>
        <div className={styles.wrapper}>
          <div className={styles.content}>
            {aboutHeading && <h2 className={styles.heading}>{aboutHeading}</h2>}
            {aboutSubheading && (
              <p className={styles.description}>{aboutSubheading}</p>
      )}
      {aboutCtaText && aboutCtaLink?.url && (
              <Button
                as="a"
          href={aboutCtaLink.url}
          target={aboutCtaLink.target || undefined}
          rel={
                  aboutCtaLink.target === "_blank"
                    ? "noopener noreferrer"
                    : undefined
          }
                variant="primary"
        >
          {aboutCtaText}
              </Button>
            )}
          </div>
          {aboutImage?.sourceUrl && (
            <div className={styles.imageWrapper}>
              <Image
                src={aboutImage.sourceUrl}
                alt={aboutImage.altText || ""}
                fill
                className={styles.image}
                unoptimized
              />
            </div>
      )}
        </div>
      </Container>
    </section>
  );
}
