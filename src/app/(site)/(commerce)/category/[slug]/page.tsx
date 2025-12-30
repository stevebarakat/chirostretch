import { notFound } from "next/navigation";
import { wpQuery } from "@/lib/cms/graphql";
import { Container } from "@/components/UI";
import { ArticlesTaxonomySearch } from "@/components/Articles/ArticlesSearch";
import { ProductsTaxonomySearch } from "@/components/Products/ProductsSearch";
import styles from "@/app/(site)/archive.module.css";

export const revalidate = 300;

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

const GET_POST_CATEGORY_QUERY = `
  query GetPostCategory($slug: ID!) {
    category(id: $slug, idType: SLUG) {
      id
      name
      slug
      description
    }
  }
`;

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

type CategoryResponse = {
  category?: {
    id?: string;
    name?: string;
    slug?: string;
    description?: string;
  } | null;
};

type ProductCategoryResponse = {
  productCategory?: {
    id?: string;
    name?: string;
    slug?: string;
    description?: string;
  } | null;
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;

  if (!slug) {
    notFound();
  }

  // Try post category first
  const postCategoryData = await wpQuery<CategoryResponse>(
    GET_POST_CATEGORY_QUERY,
    { slug },
    300
  );

  if (postCategoryData?.category?.slug) {
    return (
      <main className={styles.main}>
        <Container>
          <ArticlesTaxonomySearch
            taxonomyType="category"
            slug={slug}
            title={postCategoryData.category.name || "Category"}
            subtitle={postCategoryData.category.description}
          />
        </Container>
      </main>
    );
  }

  // Try product category
  const productCategoryData = await wpQuery<ProductCategoryResponse>(
    GET_PRODUCT_CATEGORY_QUERY,
    { slug },
    300
  );

  if (productCategoryData?.productCategory?.slug) {
    return (
      <main className={styles.main}>
        <Container>
          <ProductsTaxonomySearch
            taxonomyType="category"
            slug={slug}
            title={productCategoryData.productCategory.name || "Category"}
            subtitle={productCategoryData.productCategory.description}
          />
        </Container>
      </main>
    );
  }

  notFound();
}
