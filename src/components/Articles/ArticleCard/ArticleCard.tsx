import Image from "next/image";
import Link from "next/link";
import { ImageWrapper } from "@/components/UI/ImageWrapper";
import { NoImage } from "@/components/UI/NoImage";
import styles from "./ArticleCard.module.css";

type TaxonomyItem = {
  name: string;
  slug: string;
};

type ArticleCardProps = {
  title: string;
  slug: string;
  image?: string;
  imageAlt?: string;
  excerpt?: string;
  tags?: TaxonomyItem[];
  categories?: TaxonomyItem[];
};

function cleanExcerpt(excerpt: string): string {
  return excerpt
    .replace(/\[&hellip;]|\[…]|&hellip;|…$/g, "")
    .trim();
}

export function ArticleCard({
  title,
  slug,
  image,
  imageAlt,
  excerpt,
  tags = [],
  categories = [],
}: ArticleCardProps) {
  const hasTaxonomies = tags.length > 0 || categories.length > 0;
  const articleUrl = `/articles/${slug}`;
  const cleanedExcerpt = excerpt ? cleanExcerpt(excerpt) : "";

  return (
    <article className={styles.card}>
      <Link href={articleUrl} className={styles.imageLink}>
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
      </Link>
      <div className={styles.content}>
        <h3 className={styles.cardTitle}>
          <Link href={articleUrl} className={styles.titleLink}>
            {title}
          </Link>
        </h3>
        {cleanedExcerpt && (
          <p className={styles.excerpt}>
            {cleanedExcerpt}
            <Link href={articleUrl} className={styles.readMore}>
              Read more
            </Link>
          </p>
        )}
        {hasTaxonomies && (
          <div className={styles.taxonomies}>
            {tags.length > 0 && (
              <div className={styles.taxonomyRow}>
                <span className={styles.taxonomyLabel}>Tags:</span>
                <div className={styles.taxonomyList}>
                  {tags.map((tag) => (
                    <Link
                      key={tag.slug}
                      href={`/tag/${tag.slug}`}
                      className={styles.tag}
                    >
                      {tag.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
            {categories.length > 0 && (
              <div className={styles.taxonomyRow}>
                <span className={styles.taxonomyLabel}>
                  {categories.length === 1 ? "Category:" : "Categories:"}
                </span>
                <div className={styles.taxonomyList}>
                  {categories.map((category) => (
                    <Link
                      key={category.slug}
                      href={`/category/${category.slug}`}
                      className={styles.category}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
