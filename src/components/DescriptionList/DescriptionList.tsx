import Image from "next/image";
import { Container } from "@/components/UI";
import styles from "./DescriptionList.module.css";

type DescriptionListItem = {
  itemIcon?: {
    altText?: string;
    sourceUrl?: string;
  };
  itemTitle?: string;
  itemDescription?: string;
};

type DescriptionListProps = {
  descriptionListItems?: DescriptionListItem[];
};

export default function DescriptionList({
  descriptionListItems,
}: DescriptionListProps) {
  if (!descriptionListItems || descriptionListItems.length === 0) return null;

  return (
    <section className={styles.section}>
      <Container>
        <ul className={styles.list}>
          {descriptionListItems.map((item, index) => (
            <li key={index} className={styles.item}>
              {item.itemIcon?.sourceUrl && (
                <Image
                  src={item.itemIcon.sourceUrl}
                  alt={item.itemIcon.altText || ""}
                  width={24}
                  height={24}
                  quality={75}
                  className={styles.itemIcon}
                />
              )}
              <div className={styles.itemContent}>
                {item.itemTitle && (
                  <h3 className={styles.itemTitle}>{item.itemTitle}</h3>
                )}
                {item.itemDescription && (
                  <p className={styles.itemDescription}>
                    {item.itemDescription}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
