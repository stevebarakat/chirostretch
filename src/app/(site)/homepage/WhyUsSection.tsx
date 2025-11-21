import Image from "next/image";
import Container from "@/components/ui/Container";
import styles from "./WhyUsSection.module.css";

type Benefit = {
  benefitIcon?: {
    sourceUrl?: string;
    altText?: string;
    srcSet?: string;
    sizes?: string;
    mediaDetails?: {
      width?: number;
      height?: number;
    };
  };
  benefitTitle?: string;
  benefitDescription?: string;
};

type WhyUsSectionProps = {
  whyusHeading?: string;
  whyusDescription?: string;
  whyusImage?: {
    sourceUrl?: string;
    altText?: string;
    srcSet?: string;
    sizes?: string;
    mediaDetails?: {
      width?: number;
      height?: number;
    };
  };
  whyusBenefits?: Benefit[];
};

export default function WhyUsSection({
  whyusHeading,
  whyusDescription,
  whyusImage,
  whyusBenefits,
}: WhyUsSectionProps) {
  if (!whyusHeading) return null;

  return (
    <section className={styles.section}>
      <Container>
        <div className={styles.wrapper}>
          <div className={styles.content}>
            {whyusHeading && (
              <h2 className={styles.heading}>{whyusHeading}</h2>
            )}
            {whyusDescription && (
              <p className={styles.description}>{whyusDescription}</p>
      )}
      {whyusBenefits && whyusBenefits.length > 0 && (
              <ul className={styles.benefits}>
          {whyusBenefits.map((benefit, index) => (
                  <li key={index} className={styles.benefit}>
              {benefit.benefitIcon?.sourceUrl && (
                <Image
                  src={benefit.benefitIcon.sourceUrl}
                  alt={benefit.benefitIcon.altText || ""}
                        width={24}
                        height={24}
                  quality={75}
                        className={styles.benefitIcon}
                />
              )}
                    <div className={styles.benefitContent}>
                      {benefit.benefitTitle && (
                        <h3 className={styles.benefitTitle}>
                          {benefit.benefitTitle}
                        </h3>
                      )}
                      {benefit.benefitDescription && (
                        <p className={styles.benefitDescription}>
                          {benefit.benefitDescription}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {whyusImage?.sourceUrl && (
            <div className={styles.imageWrapper}>
              <Image
                src={whyusImage.sourceUrl}
                alt={whyusImage.altText || ""}
                fill
                quality={75}
                sizes="(min-width: 768px) 50vw, 100vw"
                className={styles.image}
              />
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}

