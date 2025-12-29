import Image from "next/image";
import { notFound } from "next/navigation";
import { wpQuery } from "@/app/_lib/wp/graphql";
import {
  POST_BY_SLUG_QUERY,
  ALL_POST_SLUGS_QUERY,
  type PostBySlugResponse,
  type AllPostSlugsResponse,
} from "@/lib/graphql/queries";
import { Container } from "@/components/UI/Container";
import { BlockRenderer, type Block } from "@/components/Blocks";
import styles from "./page.module.css";

export const revalidate = 300;

export async function generateStaticParams() {
  try {
    const data = await wpQuery<AllPostSlugsResponse>(
      ALL_POST_SLUGS_QUERY,
      {},
      300
    );

    const posts = data.posts?.nodes ?? [];

    return posts
      .filter((post) => post.slug)
      .map((post) => ({
        slug: post.slug!,
      }));
  } catch (error) {
    console.error("Error generating static params for articles:", error);
    return [];
  }
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
    300
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
                      <span key={category.id} className={styles.category}>
                        {category.name}
                      </span>
                    ))}
                  </div>
                )}
                {post.tags?.nodes && post.tags.nodes.length > 0 && (
                  <div className={styles.tags}>
                    <span className={styles.taxonomyLabel}>Tags:</span>
                    {post.tags.nodes.map((tag) => (
                      <span key={tag.id} className={styles.tag}>
                        {tag.name}
                      </span>
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
            <div
              className={styles.content}
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          ) : null}
        </article>
      </Container>
    </main>
  );
}
