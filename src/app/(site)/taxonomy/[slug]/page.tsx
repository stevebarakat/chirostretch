import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { wpQuery } from "@/app/_lib/wp/graphql";
import {
  POSTS_BY_CATEGORY_QUERY,
  type PostsByCategoryResponse,
  PRODUCTS_BY_CATEGORY_QUERY,
  type ProductsByCategoryResponse,
  POSTS_BY_TAG_QUERY,
  type PostsByTagResponse,
  PRODUCTS_BY_TAG_QUERY,
  type ProductsByTagResponse,
} from "@/lib/graphql/queries";
import Container from "@/components/ui/Container";
import PageHeader from "@/components/ui/PageHeader";
import Pagination from "@/components/ui/Pagination";
import styles from "@/app/(site)/archive.module.css";

export const revalidate = 300;

const POSTS_PER_PAGE = 6;

type TaxonomyPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ after?: string }>;
};

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

const GET_PRODUCT_CATEGORY_QUERY = `
  query GetProductCategory($slug: ID!) {
    productCategory(id: $slug, idType: SLUG) {
      id
      name
      slug
      description
    }
  }
`;

const GET_PRODUCT_TAG_QUERY = `
  query GetProductTag($slug: ID!) {
    productTag(id: $slug, idType: SLUG) {
      id
      databaseId
      name
      slug
      description
    }
  }
`;

type ProductCategoryResponse = {
  productCategory?: {
    id?: string;
    name?: string;
    slug?: string;
    description?: string;
  } | null;
};

type ProductTagResponse = {
  productTag?: {
    id?: string;
    databaseId?: number;
    name?: string;
    slug?: string;
    description?: string;
  } | null;
};

export default async function TaxonomyPage({
  params,
  searchParams,
}: TaxonomyPageProps) {
  const { slug } = await params;
  const searchParamsResolved = await searchParams;
  const after = searchParamsResolved.after || null;

  if (!slug) {
    notFound();
  }

  const baseVariables: {
    slug: string;
    categoryName?: string;
    tagName?: string;
    first: number;
    after?: string | null;
  } = {
    slug,
    first: POSTS_PER_PAGE,
  };

  if (after) {
    baseVariables.after = after;
  }

  // Try post category first
  const postCategoryVars = { ...baseVariables, categoryName: slug };
  const postCategoryData = await wpQuery<PostsByCategoryResponse>(
    POSTS_BY_CATEGORY_QUERY,
    postCategoryVars,
    300
  );

  if (postCategoryData?.category) {
    return renderArchive(
      postCategoryData.category,
      postCategoryData.posts?.nodes ?? [],
      postCategoryData.posts?.pageInfo,
      `/taxonomy/${slug}`
    );
  }

  // Try product category
  const productCategoryData = await wpQuery<ProductCategoryResponse>(
    GET_PRODUCT_CATEGORY_QUERY,
    { slug },
    300
  );

  if (productCategoryData?.productCategory?.slug) {
    const productVars = {
      slug,
      categorySlug: productCategoryData.productCategory.slug,
      first: POSTS_PER_PAGE,
      after: after || undefined,
    };

    const productData = await wpQuery<ProductsByCategoryResponse>(
      PRODUCTS_BY_CATEGORY_QUERY,
      productVars,
      300
    );

    if (productData?.productCategory) {
      return renderProductArchive(
        productData.productCategory,
        productData.products?.nodes ?? [],
        productData.products?.pageInfo,
        `/taxonomy/${slug}`
      );
    }
  }

  // Try post tag
  const postTagVars = { ...baseVariables, tagName: slug };
  const postTagData = await wpQuery<PostsByTagResponse>(
    POSTS_BY_TAG_QUERY,
    postTagVars,
    300
  );

  if (postTagData?.tag) {
    return renderArchive(
      postTagData.tag,
      postTagData.posts?.nodes ?? [],
      postTagData.posts?.pageInfo,
      `/taxonomy/${slug}`
    );
  }

  // Try product tag
  const productTagData = await wpQuery<ProductTagResponse>(
    GET_PRODUCT_TAG_QUERY,
    { slug },
    300
  );

  if (productTagData?.productTag?.slug) {
    const productVars = {
      slug,
      tagId: productTagData.productTag.databaseId,
      first: POSTS_PER_PAGE,
      after: after || undefined,
    };

    const productData = await wpQuery<ProductsByTagResponse>(
      PRODUCTS_BY_TAG_QUERY,
      productVars,
      300
    );

    if (productData?.productTag) {
      return renderProductArchive(
        productData.productTag,
        productData.products?.nodes ?? [],
        productData.products?.pageInfo,
        `/taxonomy/${slug}`
      );
    }
  }

  // Nothing found
  notFound();
}

function renderArchive(
  term: { name?: string; description?: string },
  posts: any[],
  pageInfo: any,
  currentPath: string
) {
  return (
    <main className={styles.main}>
      <Container>
        <PageHeader
          title={term.name || "Archive"}
          subtitle={term.description || `View all articles`}
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
                            {post.categories.nodes.map((category: any) => (
                              <Link
                                key={category.id}
                                href={`/taxonomy/${category.slug}`}
                                className={styles.category}
                              >
                                {category.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      {post.tags?.nodes && post.tags.nodes.length > 0 && (
                        <div className={styles.categories}>
                          {post.tags.nodes.map((tag: any) => (
                            <Link
                              key={tag.id}
                              href={`/taxonomy/${tag.slug}`}
                              className={styles.category}
                            >
                              {tag.name}
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
                currentPath={currentPath}
              />
            )}
          </>
        ) : (
          <div className={styles.empty}>
            <p>No articles found.</p>
          </div>
        )}
      </Container>
    </main>
  );
}

function renderProductArchive(
  term: { name?: string; description?: string },
  products: any[],
  pageInfo: any,
  currentPath: string
) {
  return (
    <main className={styles.main}>
      <Container>
        <PageHeader
          title={term.name || "Archive"}
          subtitle={term.description || `View all products`}
        />
        {products.length > 0 ? (
          <>
            <div className={styles.grid}>
              {products.map((product) => {
                if (!product.slug) return null;

                const image = product.featuredImage?.node;
                const imageWidth = image?.mediaDetails?.width || 800;
                const imageHeight = image?.mediaDetails?.height || 450;

                return (
                  <article
                    key={product.id || product.slug}
                    className={styles.card}
                  >
                    {image?.sourceUrl ? (
                      <Link
                        href={`/products/${product.slug}`}
                        className={styles.imageLink}
                      >
                        <div className={styles.imageWrapper}>
                          <Image
                            src={image.sourceUrl}
                            alt={
                              image.altText || product.name || "Product image"
                            }
                            width={imageWidth}
                            height={imageHeight}
                            className={styles.image}
                            sizes="(max-width: 639px) 100vw, 320px"
                          />
                        </div>
                      </Link>
                    ) : (
                      <Link
                        href={`/products/${product.slug}`}
                        className={styles.imageLink}
                      >
                        <div className={styles.imageWrapper}>
                          <div className={styles.placeholder}>No Image</div>
                        </div>
                      </Link>
                    )}
                    <div className={styles.content}>
                      <Link
                        href={`/products/${product.slug}`}
                        className={styles.titleLink}
                      >
                        <h3 className={styles.cardTitle}>{product.name}</h3>
                      </Link>
                      {product.price && (
                        <div className={styles.meta}>
                          <span className={styles.price}>
                            {product.salePrice ? (
                              <>
                                <span className={styles.regularPrice}>
                                  ${product.regularPrice}
                                </span>
                                <span className={styles.salePrice}>
                                  ${product.salePrice}
                                </span>
                              </>
                            ) : (
                              <span className={styles.price}>
                                ${product.price}
                              </span>
                            )}
                          </span>
                          {product.stockStatus && (
                            <span
                              className={`${styles.stockStatus} ${
                                product.stockStatus === "IN_STOCK"
                                  ? styles.inStock
                                  : styles.outOfStock
                              }`}
                            >
                              {product.stockStatus === "IN_STOCK"
                                ? "In Stock"
                                : "Out of Stock"}
                            </span>
                          )}
                        </div>
                      )}
                      {product.productCategories?.nodes &&
                        product.productCategories.nodes.length > 0 && (
                          <div className={styles.categories}>
                            {product.productCategories.nodes.map(
                              (productCategory: any) => (
                                <Link
                                  key={productCategory.id}
                                  href={`/taxonomy/${productCategory.slug}`}
                                  className={styles.category}
                                >
                                  {productCategory.name}
                                </Link>
                              )
                            )}
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
                currentPath={currentPath}
              />
            )}
          </>
        ) : (
          <div className={styles.empty}>
            <p>No products found.</p>
          </div>
        )}
      </Container>
    </main>
  );
}
