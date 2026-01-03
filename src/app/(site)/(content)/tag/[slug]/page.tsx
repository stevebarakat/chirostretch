import { notFound } from "next/navigation";
import { wpQuery, CACHE_TAGS } from "@/lib/cms/graphql";
import { Container, Breadcrumbs } from "@/components/UI";
import { ArticlesTaxonomySearch } from "@/components/Articles/ArticlesSearch";
import { ProductsTaxonomySearch } from "@/components/Products/ProductsSearch";
import styles from "@/app/(site)/archive.module.css";

export const revalidate = 300;

type TagPageProps = {
  params: Promise<{ slug: string }>;
};

const GET_POST_TAG_QUERY = `
  query GetPostTag($slug: ID!) {
    tag(id: $slug, idType: SLUG) {
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
      name
      slug
      description
    }
  }
`;

type TagResponse = {
  tag?: {
    id?: string;
    name?: string;
    slug?: string;
    description?: string;
  } | null;
};

type ProductTagResponse = {
  productTag?: {
    id?: string;
    name?: string;
    slug?: string;
    description?: string;
  } | null;
};

export default async function TagPage({ params }: TagPageProps) {
  const { slug } = await params;

  if (!slug) {
    notFound();
  }

  // Try post tag first
  const postTagData = await wpQuery<TagResponse>(
    GET_POST_TAG_QUERY,
    { slug },
    { tags: [CACHE_TAGS.posts] }
  );

  if (postTagData?.tag?.slug) {
    const breadcrumbs = [
      { label: "Articles", href: "/articles" },
      { label: postTagData.tag.name ?? "Tag" },
    ];

    return (
      <main className={styles.main}>
        <Container>
          <Breadcrumbs items={breadcrumbs} />
          <ArticlesTaxonomySearch
            taxonomyType="tag"
            slug={slug}
            title={postTagData.tag.name || "Tag"}
            subtitle={postTagData.tag.description}
          />
        </Container>
      </main>
    );
  }

  // Try product tag
  const productTagData = await wpQuery<ProductTagResponse>(
    GET_PRODUCT_TAG_QUERY,
    { slug },
    { tags: [CACHE_TAGS.products] }
  );

  if (productTagData?.productTag?.slug) {
    const breadcrumbs = [
      { label: "Shop", href: "/shop" },
      { label: productTagData.productTag.name ?? "Tag" },
    ];

    return (
      <main className={styles.main}>
        <Container>
          <Breadcrumbs items={breadcrumbs} />
          <ProductsTaxonomySearch
            taxonomyType="tag"
            slug={slug}
            title={productTagData.productTag.name || "Tag"}
            subtitle={productTagData.productTag.description}
          />
        </Container>
      </main>
    );
  }

  notFound();
}
