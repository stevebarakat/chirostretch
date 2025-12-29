import Image from "next/image";
import { Container } from "@/components/UI";
import { Button } from "@/components/UI";
import { ImageWrapper } from "@/components/UI";
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
  aboutCta2Text?: string;
  aboutCta2Link?: AcfLink;
};

export default function AboutSection({
  aboutHeading,
  aboutSubheading,
  aboutImage,
  aboutCtaText,
  aboutCtaLink,
  aboutCta2Text,
  aboutCta2Link,
}: AboutSectionProps) {
  const imgUrl = aboutImage?.sourceUrl || "";

  return (
    <section className={styles.section}>
      <Container>
        <div className={styles.wrapper}>
          <div className={styles.content}>
            {aboutHeading && <h2 className={styles.heading}>{aboutHeading}</h2>}

            {aboutSubheading && (
              <div
                className={styles.description}
                dangerouslySetInnerHTML={{ __html: aboutSubheading }}
              ></div>
            )}

            <div className={styles.ctaWrapper}>
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
                >
                  {aboutCtaText}
                </Button>
              )}

              {aboutCta2Text && aboutCta2Link?.url && (
                <Button
                  as="a"
                  href={aboutCta2Link.url}
                  target={aboutCta2Link.target || undefined}
                  rel={
                    aboutCta2Link.target === "_blank"
                      ? "noopener noreferrer"
                      : undefined
                  }
                  variant="outline"
                >
                  {aboutCta2Text}
                </Button>
              )}
            </div>
          </div>

          {imgUrl && (
            <ImageWrapper className={styles.imageWrapper}>
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
            </ImageWrapper>
          )}
        </div>
      </Container>
    </section>
  );
}
