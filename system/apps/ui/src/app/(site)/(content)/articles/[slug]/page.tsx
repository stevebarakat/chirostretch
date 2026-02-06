import Image from "next/image";
import { notFound } from "next/navigation";
import { wpQuery, CACHE_TAGS } from "@/lib/cms/graphql";
import {
  POST_BY_SLUG_QUERY,
  type PostBySlugResponse,
} from "@/lib/graphql/queries";
import { Container, Button } from "@/components/Primitives";
import { BlockRenderer, type Block, parseHtml } from "@/components/Blocks";
import styles from "./page.module.css";

export const revalidate = 300;

// Skip static generation - pages are built on-demand with ISR
export async function generateStaticParams() {
  return [];
}

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

function cleanExcerpt(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/\[&hellip;]|\[…]|&hellip;|…$/g, "")
    .trim();
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;

  const data = await wpQuery<PostBySlugResponse>(
    POST_BY_SLUG_QUERY,
    { slug },
    { tags: [CACHE_TAGS.posts] }
  );

  if (!data?.post) {
    notFound();
  }

  const post = data.post;
  const image = post.featuredImage?.node;
  const imageWidth = image?.mediaDetails?.width || 1200;
  const imageHeight = image?.mediaDetails?.height || 800;

  return (
    <main className={styles.main}>
      <Container>
        <article className={styles.article}>
          {image?.sourceUrl && (
            <div className={styles.featuredImage}>
              <Image
                src={image.sourceUrl}
                alt={image.altText || post.title || "Article image"}
                width={imageWidth}
                height={imageHeight}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                priority={true}
                fetchPriority="high"
                className={styles.image}
              />
            </div>
          )}

          <header className={styles.header}>
            <h1 className={styles.title}>{post.title}</h1>
            <div className={styles.meta}>
              {post.author?.node?.name && (
                <span className={styles.author}>
                  By {post.author.node.name}
                </span>
              )}
              {post.date && (
                <time className={styles.date} dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              )}
            </div>
            {(post.categories?.nodes && post.categories.nodes.length > 0) ||
            (post.tags?.nodes && post.tags.nodes.length > 0) ? (
              <div className={styles.taxonomies}>
                {post.categories?.nodes && post.categories.nodes.length > 0 && (
                  <div className={styles.categories}>
                    <span className={styles.taxonomyLabel}>Categories:</span>
                    {post.categories.nodes.map((category) => (
                      <Button
                        key={category.id}
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
                )}
                {post.tags?.nodes && post.tags.nodes.length > 0 && (
                  <div className={styles.tags}>
                    <span className={styles.taxonomyLabel}>Tags:</span>
                    {post.tags.nodes.map((tag) => (
                      <Button
                        key={tag.id}
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
                )}
              </div>
            ) : null}
          </header>

          {post.excerpt && (
            <div className={styles.excerpt}>
              <p>{cleanExcerpt(post.excerpt)}</p>
            </div>
          )}

          {post.blocks &&
          Array.isArray(post.blocks) &&
          post.blocks.length > 0 ? (
            <div className={styles.content}>
              <BlockRenderer blocks={post.blocks as Block[]} />
            </div>
          ) : post.content ? (
            <div className={styles.content}>
              {parseHtml(post.content)}
            </div>
          ) : null}
        </article>
      </Container>
    </main>
  );
}
