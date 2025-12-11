import Image from "next/image";
import Link from "next/link";
import { wpQuery } from "@/app/_lib/wp/graphql";
import { ALL_POSTS_QUERY, type AllPostsResponse } from "@/lib/graphql/queries";
import Container from "@/components/ui/Container";
import PageHeader from "@/components/ui/PageHeader";
import Pagination from "@/components/ui/Pagination";
import styles from "./page.module.css";

export const revalidate = 300;

const POSTS_PER_PAGE = 6;

type ArticlesPageProps = {
  searchParams: Promise<{ after?: string }>;
};

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

export default async function ArticlesPage({
  searchParams,
}: ArticlesPageProps) {
  const params = await searchParams;
  const after = params.after || null;

  const variables: { first: number; after?: string | null } = {
    first: POSTS_PER_PAGE,
  };

  if (after) {
    variables.after = after;
  }

  const data = await wpQuery<AllPostsResponse>(ALL_POSTS_QUERY, variables, 300);
  const posts = data.posts?.nodes ?? [];
  const pageInfo = data.posts?.pageInfo;

  return (
    <main className={styles.main}>
      <Container>
        <PageHeader
          title="Articles"
          subtitle="Insights, tips, and updates from our team"
        />
        {posts.length > 0 ? (
          <>
            <div className={styles.grid}>
              {posts.map((post) => {
                if (!post.slug) return null;

                const image = post.featuredImage?.node;
                const imageWidth = image?.mediaDetails?.width || 800;
                const imageHeight = image?.mediaDetails?.height || 450;
                const excerpt = post.excerpt
                  ? stripHtml(post.excerpt)
                  : post.content
                  ? stripHtml(post.content).substring(0, 150) + "..."
                  : "";

                return (
                  <Link
                    key={post.id || post.slug}
                    href={`/articles/${post.slug}`}
                    className={styles.card}
                  >
                    {image?.sourceUrl ? (
                      <div className={styles.imageWrapper}>
                        <Image
                          src={image.sourceUrl}
                          alt={image.altText || post.title || "Article image"}
                          width={imageWidth}
                          height={imageHeight}
                          className={styles.image}
                          sizes="(max-width: 639px) 100vw, 320px"
                        />
                      </div>
                    ) : (
                      <div className={styles.imageWrapper}>
                        <div className={styles.placeholder}>No Image</div>
                      </div>
                    )}
                    <div className={styles.content}>
                      <h3 className={styles.cardTitle}>{post.title}</h3>
                      {post.author?.node?.name && (
                        <div className={styles.meta}>
                          <span className={styles.author}>
                            By {post.author.node.name}
                          </span>
                          {post.date && (
                            <span className={styles.date}>
                              {new Date(post.date).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </span>
                          )}
                        </div>
                      )}
                      {excerpt && <p className={styles.excerpt}>{excerpt}</p>}
                      {post.categories?.nodes &&
                        post.categories.nodes.length > 0 && (
                          <div className={styles.categories}>
                            {post.categories.nodes.map((category) => (
                              <span
                                key={category.id}
                                className={styles.category}
                              >
                                {category.name}
                              </span>
                            ))}
                          </div>
                        )}
                    </div>
                  </Link>
                );
              })}
            </div>
            {pageInfo && (
              <Pagination
                hasNextPage={pageInfo.hasNextPage ?? false}
                hasPreviousPage={pageInfo.hasPreviousPage ?? false}
                endCursor={pageInfo.endCursor}
                startCursor={pageInfo.startCursor}
                currentPath="/articles"
              />
            )}
          </>
        ) : (
          <div className={styles.empty}>
            <p>No articles available at this time.</p>
          </div>
        )}
      </Container>
    </main>
  );
}
