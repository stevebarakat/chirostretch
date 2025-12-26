import Image from "next/image";
import { ImageWrapper } from "@/components/UI/ImageWrapper";
import { NoImage } from "@/components/UI/NoImage";
import styles from "./ArticleCard.module.css";

type ArticleCardProps = {
  title: string;
  image?: string;
  imageAlt?: string;
  excerpt?: string;
  categories?: string;
};

export function ArticleCard({
  title,
  image,
  imageAlt,
  excerpt,
  categories,
}: ArticleCardProps) {
  const categoryList = categories?.split(", ").filter(Boolean) || [];

  return (
    <article className={styles.card}>
      {image ? (
        <ImageWrapper className={styles.imageWrapper}>
          <Image
            src={image}
            alt={imageAlt || title || "Article image"}
            fill
            className={styles.image}
            sizes="(max-width: 639px) 100vw, 320px"
          />
        </ImageWrapper>
      ) : (
        <ImageWrapper className={styles.imageWrapper}>
          <NoImage />
        </ImageWrapper>
      )}
      <div className={styles.content}>
        <h3 className={styles.cardTitle}>{title}</h3>
        {excerpt && <p className={styles.excerpt}>{excerpt}</p>}
        {categoryList.length > 0 && (
          <div className={styles.categories}>
            {categoryList.map((category) => (
              <span key={category} className={styles.category}>
                {category}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
