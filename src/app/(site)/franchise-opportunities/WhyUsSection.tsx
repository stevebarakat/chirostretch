import Image from "next/image";
import { Container } from "@/components/UI/Container";
import styles from "./WhyUsSection.module.css";

type DescriptionListItem = {
  itemIcon?: {
    sourceUrl?: string;
    altText?: string;
    srcSet?: string;
    sizes?: string;
    mediaDetails?: {
      width?: number;
      height?: number;
    };
  };
  itemTitle?: string;
  itemDescription?: string;
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
  descriptionListItems?: DescriptionListItem[];
};

export default function WhyUsSection({
  whyusHeading,
  whyusDescription,
  whyusImage,
  descriptionListItems,
}: WhyUsSectionProps) {
  if (!whyusHeading) return null;

  return (
    <section className={styles.section}>
      <Container>
        <div className={styles.wrapper}>
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
          <div className={styles.content}>
            {whyusHeading && <h2 className={styles.heading}>{whyusHeading}</h2>}
            {whyusDescription && (
              <p className={styles.description}>{whyusDescription}</p>
            )}
            {descriptionListItems && descriptionListItems.length > 0 && (
              <ul className={styles.benefits}>
                {descriptionListItems.map((item, index) => (
                  <li key={index} className={styles.benefit}>
                    {item.itemIcon?.sourceUrl && (
                      <Image
                        src={item.itemIcon.sourceUrl}
                        alt={item.itemIcon.altText || ""}
                        width={24}
                        height={24}
                        quality={75}
                        className={styles.benefitIcon}
                      />
                    )}
                    <div className={styles.benefitContent}>
                      {item.itemTitle && (
                        <h3 className={styles.benefitTitle}>
                          {item.itemTitle}
                        </h3>
                      )}
                      {item.itemDescription && (
                        <p className={styles.benefitDescription}>
                          {item.itemDescription}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
