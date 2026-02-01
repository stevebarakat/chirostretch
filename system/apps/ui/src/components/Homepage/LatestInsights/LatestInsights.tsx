import Image from "next/image";
import Link from "next/link";
import { SectionHeading, Button, ImageWrapper, Text } from "@/components/Primitives";
import { rewriteImageUrl } from "@/utils/image-helpers";
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
            {displayPosts.map((post, i) => {
              if (!post.slug) return null;

              const image = post.featuredImage?.node;
              const imageUrl = rewriteImageUrl(image?.sourceUrl);
              const imageWidth = image?.mediaDetails?.width || 800;
              const imageHeight = image?.mediaDetails?.height || 450;
              const excerpt = post.excerpt ? stripHtml(post.excerpt) : "";

              return (
                <article key={post.id || post.slug} className={styles.postCard}>
                  {imageUrl && (
                    <ImageWrapper className={styles.imageWrapper}>
                      <Link href={`/articles/${post.slug}`}>
                        <Image
                          src={imageUrl}
                          alt={image?.altText || post.title || "Article image"}
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
                    {post.categories?.nodes &&
                      post.categories.nodes.length > 0 && (
                        <div className={styles.categories}>
                          {post.categories.nodes.map((category) => (
                            <Button
                              key={category.id}
                              as="Link"
                              href={`/category/${category.slug}`}
                              size="xs"
                              variant="inverse"
                              color={i === 0 ? "secondary" : "primary"}
                            >
                              {category.name}
                            </Button>
                          ))}
                        </div>
                      )}
                    {excerpt && <RichText content={excerpt} />}

                    <Button
                      as="Link"
                      href={`/articles/${post.slug}`}
                      color="glass"
                      size="sm"
                      variant="outline inverse"
                    >
                      Read more →
                    </Button>
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
