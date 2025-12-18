import { wpQuery } from "@app/_lib/wp/graphql";
import {
  PRODUCT_BY_SLUG_QUERY,
  ALL_PRODUCT_SLUGS_QUERY,
  type ProductBySlugResponse,
  type AllProductSlugsResponse,
} from "@/lib/graphql/queries";
import { notFound } from "next/navigation";
import { Container } from "@/components/UI/Container";
import ProductGallery from "./ProductGallery";
import ProductInfo from "./ProductInfo";
import RelatedProducts from "./RelatedProducts";
import styles from "./page.module.css";
import CartSummary from "@/components/Layout/CartSummary";

export const revalidate = 300;

export async function generateStaticParams() {
  try {
    const data = await wpQuery<AllProductSlugsResponse>(
      ALL_PRODUCT_SLUGS_QUERY,
      {},
      300
    );

    const products = data?.products?.nodes || [];

    return products.map((product) => ({
      slug: product.slug || "",
    }));
  } catch (error) {
    console.error("Failed to generate static params for products:", error);
    return [];
  }
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
    300
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
            <CartSummary />
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
