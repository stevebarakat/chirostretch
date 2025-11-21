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
    mediaDetails?: {
      width?: number;
      height?: number;
    };
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

  const imgUrl = aboutImage?.sourceUrl || "";

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

          {imgUrl && (
            <div className={styles.imageWrapper}>
              <Image
                src={imgUrl}
                alt={aboutImage?.altText || ""}
                fill
                quality={75}
                sizes="(min-width: 768px) 50vw, 100vw"
                priority
                fetchPriority="high"
                className={styles.image}
              />
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
