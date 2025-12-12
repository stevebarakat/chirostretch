import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { wpQuery } from "@/app/_lib/wp/graphql";
import {
  POSTS_BY_CATEGORY_QUERY,
  type PostsByCategoryResponse,
} from "@/lib/graphql/queries";
import Container from "@/components/ui/Container";
import PageHeader from "@/components/ui/PageHeader";
import Pagination from "@/components/ui/Pagination";
import styles from "./page.module.css";

export const revalidate = 300;

const POSTS_PER_PAGE = 6;

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ after?: string }>;
};

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { slug } = await params;
  const searchParamsResolved = await searchParams;
  const after = searchParamsResolved.after || null;

  if (!slug) {
    notFound();
  }

  const variables: {
    slug: string;
    categoryName: string;
    first: number;
    after?: string | null;
  } = {
    slug,
    categoryName: slug,
    first: POSTS_PER_PAGE,
  };

  if (after) {
    variables.after = after;
  }

  const data = await wpQuery<PostsByCategoryResponse>(
    POSTS_BY_CATEGORY_QUERY,
    variables,
    300
  );

  if (!data?.category) {
    notFound();
  }

  const category = data.category;
  const posts = data.posts?.nodes ?? [];
  const pageInfo = data.posts?.pageInfo;

  return (
    <main className={styles.main}>
      <Container>
        <PageHeader
          title={category.name || "Category"}
          subtitle={category.description || `Articles in ${category.name}`}
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
                  <article key={post.id || post.slug} className={styles.card}>
                    {image?.sourceUrl ? (
                      <Link
                        href={`/articles/${post.slug}`}
                        className={styles.imageLink}
                      >
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
                      </Link>
                    ) : (
                      <Link
                        href={`/articles/${post.slug}`}
                        className={styles.imageLink}
                      >
                        <div className={styles.imageWrapper}>
                          <div className={styles.placeholder}>No Image</div>
                        </div>
                      </Link>
                    )}
                    <div className={styles.content}>
                      <Link
                        href={`/articles/${post.slug}`}
                        className={styles.titleLink}
                      >
                        <h3 className={styles.cardTitle}>{post.title}</h3>
                      </Link>
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
                              <Link
                                key={category.id}
                                href={`/category/${category.slug}`}
                                className={styles.category}
                              >
                                {category.name}
                              </Link>
                            ))}
                          </div>
                        )}
                    </div>
                  </article>
                );
              })}
            </div>
            {pageInfo && (
              <Pagination
                hasNextPage={pageInfo.hasNextPage ?? false}
                hasPreviousPage={pageInfo.hasPreviousPage ?? false}
                endCursor={pageInfo.endCursor}
                startCursor={pageInfo.startCursor}
                currentPath={`/category/${slug}`}
              />
            )}
          </>
        ) : (
          <div className={styles.empty}>
            <p>No articles found in this category.</p>
          </div>
        )}
      </Container>
    </main>
  );
}
