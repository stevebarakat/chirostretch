import Image from "next/image";
import Link from "next/link";
import { ImageWrapper, NoImage, Text, Button } from "@/components/Primitives";
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
        <Text as="h3" className={styles.cardTitle}>
          <Link href={articleUrl} className={styles.titleLink}>
            {title}
          </Link>
        </Text>
        {cleanedExcerpt && (
          <Text className={styles.excerpt}>
            {cleanedExcerpt}
            <Link href={articleUrl} className={styles.readMore}>
              Read more
            </Link>
          </Text>
        )}
        {hasTaxonomies && (
          <div className={styles.taxonomies}>
            {tags.length > 0 && (
              <div className={styles.taxonomyRow}>
                <Text as="span" className={styles.taxonomyLabel}>Tags:</Text>
                <div className={styles.taxonomyList}>
                  {tags.map((tag) => (
                    <Button
                      key={tag.slug}
                      as="Link"
                      href={`/tag/${tag.slug}`}
                      size="xs"
                      variant="outline"
                      color="neutral"
                    >
                      {tag.name}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            {categories.length > 0 && (
              <div className={styles.taxonomyRow}>
                <Text as="span" className={styles.taxonomyLabel}>
                  {categories.length === 1 ? "Category:" : "Categories:"}
                </Text>
                <div className={styles.taxonomyList}>
                  {categories.map((category) => (
                    <Button
                      key={category.slug}
                      as="Link"
                      href={`/category/${category.slug}`}
                      size="xs"
                      variant="outline"
                      color="neutral"
                    >
                      {category.name}
                    </Button>
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
