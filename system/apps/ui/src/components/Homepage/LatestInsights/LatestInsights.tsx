import Image from "next/image";
import Link from "next/link";
import { SectionHeading, Button, ImageWrapper, Text } from "@/components/Primitives";
import styles from "./LatestInsights.module.css";
import { RichText } from "@/components/RichText";

type PostImage = {
  id?: string;
  sourceUrl?: string;
  altText?: string;
  srcSet?: string;
  sizes?: string;
  mediaDetails?: {
    width?: number;
    height?: number;
  };
};

type PostAuthor = {
  id?: string;
  name?: string;
  slug?: string;
};

type PostCategory = {
  id?: string;
  name?: string;
  slug?: string;
};

type Post = {
  id?: string;
  databaseId?: number;
  slug?: string;
  title?: string;
  excerpt?: string;
  date?: string;
  author?: {
    node?: PostAuthor;
  };
  featuredImage?: {
    node?: PostImage;
  };
  categories?: {
    nodes?: PostCategory[];
  };
};

type LatestInsightsProps = {
  insightsHeading?: string;
  insightsSubheading?: string;
  insightsCtaText?: string;
  insightsCtaLink?: string;
  posts?: Post[];
};

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

export default function LatestInsights({
  insightsHeading,
  insightsSubheading,
  posts = [],
}: LatestInsightsProps) {
  if (!insightsHeading) return null;

  const displayPosts = posts.slice(0, 2);

  return (
    <section id="latest-insights" className={styles.section}>
      <>
        <SectionHeading
          heading={insightsHeading}
          subheading={insightsSubheading}
        />
        {displayPosts.length > 0 ? (
          <div className={styles.posts}>
            {displayPosts.map((post) => {
              if (!post.slug) return null;

              const image = post.featuredImage?.node;
              const imageWidth = image?.mediaDetails?.width || 800;
              const imageHeight = image?.mediaDetails?.height || 450;
              const excerpt = post.excerpt ? stripHtml(post.excerpt) : "";

              return (
                <article key={post.id || post.slug} className={styles.postCard}>
                  {image?.sourceUrl && (
                    <ImageWrapper className={styles.imageWrapper}>
                      <Link href={`/articles/${post.slug}`}>
                        <Image
                          src={image.sourceUrl}
                          alt={image.altText || post.title || "Article image"}
                          width={imageWidth}
                          height={imageHeight}
                          className={styles.image}
                          sizes="(max-width: 767px) 100vw, 50vw"
                        />
                      </Link>
                    </ImageWrapper>
                  )}
                  <div className={styles.content}>
                    <Link
                      href={`/articles/${post.slug}`}
                      className={styles.titleLink}
                    >
                      <Text as="h3" className={styles.title}>{post.title}</Text>
                    </Link>
                    <div className={styles.meta}>
                      {post.author?.node?.name && (
                        <Text as="span" className={styles.author}>
                          By {post.author.node.name}
                        </Text>
                      )}
                      {post.date && (
                        <Text as="span" className={styles.date}>
                          {new Date(post.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </Text>
                      )}
                    </div>
                    {excerpt && <RichText content={excerpt} />}
                    {post.categories?.nodes &&
                      post.categories.nodes.length > 0 && (
                        <div className={styles.categories}>
                          {post.categories.nodes.map((category) => (
                            <Button
                              key={category.id}
                              as="Link"
                              href={`/category/${category.slug}`}
                              size="xs"
                              variant="outline"
                              color="glass"
                            >
                              {category.name}
                            </Button>
                          ))}
                        </div>
                      )}
                    <Link
                      href={`/articles/${post.slug}`}
                      className={styles.readMore}
                    >
                      Read more →
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className={styles.empty}>
            <Text>No articles available at this time.</Text>
          </div>
        )}
        {/* {insightsCtaText && insightsCtaLink && (
          <div className={styles.cta}>
            <Button as="a" href={insightsCtaLink}>
              {insightsCtaText}
            </Button>
          </div>
        )} */}
      </>
    </section>
  );
}
