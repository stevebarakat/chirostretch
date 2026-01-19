import { wpQuery, CACHE_TAGS } from "@/lib/cms/graphql";
import {
  PRODUCT_BY_SLUG_QUERY,
  ALL_PRODUCT_SLUGS_QUERY,
  type ProductBySlugResponse,
  type AllProductSlugsResponse,
} from "@/lib/graphql/queries";
import { notFound } from "next/navigation";
import { Container } from "@/components/Primitives";
import { ProductGallery, ProductInfo, RelatedProducts } from "@/components/Products";
import { CartBadge } from "@/components/Cart";
import SearchInput from "@/components/Layout/SearchInput";
import styles from "./page.module.css";

export const revalidate = 300;

// Skip static generation - pages are built on-demand with ISR
export async function generateStaticParams() {
  return [];
}

function generateProductStructuredData(
  product: NonNullable<ProductBySlugResponse["product"]>
) {
  const image = product.featuredImage?.node?.sourceUrl;
  const price = product.price || product.regularPrice;

  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription || product.description,
    image: image ? [image] : [],
    sku: product.sku,
    offers: {
      "@type": "Offer",
      url: `${process.env.NEXT_PUBLIC_SITE_URL || ""}/products/${product.slug}`,
      priceCurrency: "USD",
      price: price?.replace(/[^0-9.]/g, "") || "0",
      availability:
        product.stockStatus === "IN_STOCK"
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
    ...(product.productCategories?.nodes &&
    product.productCategories.nodes.length > 0
      ? {
          category: product.productCategories.nodes
            .map((cat) => cat.name)
            .join(", "),
        }
      : {}),
  };
}

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const data = await wpQuery<ProductBySlugResponse>(
    PRODUCT_BY_SLUG_QUERY,
    { slug },
    { tags: [CACHE_TAGS.products] }
  );

  if (!data?.product) {
    notFound();
  }

  const product = data.product;
  const structuredData = generateProductStructuredData(product);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Container>
        <div className={styles.productPage}>
          <div className={styles.productSummary}>
            <SearchInput />
            <CartBadge />
          </div>
          <div className={styles.productLayout}>
            <ProductGallery
              mainImage={product.featuredImage?.node}
              galleryImages={product.galleryImages?.nodes}
            />
            <ProductInfo product={product} />
          </div>
          {product.description && (
            <div className={styles.productDescription}>
              <h2>Description</h2>
              <div dangerouslySetInnerHTML={{ __html: product.description }} />
            </div>
          )}
          {product.related &&
            product.related.nodes &&
            product.related.nodes.length > 0 && (
              <RelatedProducts products={product.related.nodes} />
            )}
        </div>
      </Container>
    </>
  );
}
