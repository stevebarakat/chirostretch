import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import styles from "./FeaturedProducts.module.css";

type Product = {
  id?: string;
  __typename?: string;
  name?: string;
  title?: string;
  slug?: string;
  price?: string;
  image?: {
    sourceUrl?: string;
    altText?: string;
    srcSet?: string;
    sizes?: string;
    mediaDetails?: {
      width?: number;
      height?: number;
    };
  };
  featuredImage?: {
    node?: {
      sourceUrl?: string;
      altText?: string;
      srcSet?: string;
      sizes?: string;
      mediaDetails?: {
        width?: number;
        height?: number;
      };
    };
  };
};

type FeaturedProductsProps = {
  featuredProductsHeading?: string;
  featuredProductsSubheading?: string;
  featuredProductsSource?: string | string[];
  featuredProductsManual?: {
    product?: {
      nodes?: Product[];
    };
  }[];
  featuredProductsFromQuery?: {
    nodes?: Array<{
      id?: string;
      name?: string;
      slug?: string;
      price?: string;
      featuredImage?: {
        node?: {
          id?: string;
          sourceUrl?: string;
          altText?: string;
        };
      };
    }>;
  };
};

export default function FeaturedProducts({
  featuredProductsHeading,
  featuredProductsSubheading,
  featuredProductsSource,
  featuredProductsManual,
  featuredProductsFromQuery,
}: FeaturedProductsProps) {
  if (!featuredProductsHeading) return null;

  const products: Product[] = [];

  const sourceArray = Array.isArray(featuredProductsSource)
    ? featuredProductsSource
    : featuredProductsSource
    ? [featuredProductsSource]
    : [];

  if (sourceArray.includes("featured") && featuredProductsFromQuery?.nodes) {
    featuredProductsFromQuery.nodes.forEach((product) => {
      if (product) {
        products.push({
          id: product.id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          featuredImage: product.featuredImage,
        });
      }
    });
  }

  if (
    sourceArray.includes("manual") &&
    featuredProductsManual &&
    Array.isArray(featuredProductsManual)
  ) {
    featuredProductsManual.forEach((item) => {
      if (item?.product?.nodes && Array.isArray(item.product.nodes)) {
        item.product.nodes.forEach((product) => {
          if (product) {
            products.push({
              id: product.id,
              name: product.name || product.title,
              slug: product.slug,
              featuredImage: product.featuredImage,
            });
          }
        });
      }
    });
  }

  return (
    <section className={styles.section}>
      <Container>
        <SectionHeading
          heading={featuredProductsHeading}
          subheading={featuredProductsSubheading}
        />
        {products.length > 0 ? (
          <div className={styles.grid}>
            {products.map((product) => {
              const imageUrl =
                product.image?.sourceUrl ||
                product.featuredImage?.node?.sourceUrl;
              const imageAlt =
                product.image?.altText ||
                product.featuredImage?.node?.altText ||
                product.name ||
                product.title ||
                "Product";

              return (
                <div key={product.id} className={styles.productCard}>
                  {imageUrl ? (
                    <div className={styles.imageWrapper}>
                      <Image
                        src={imageUrl}
                        alt={imageAlt}
                        fill
                        quality={75}
                        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                        className={styles.image}
                      />
                    </div>
                  ) : (
                    <div className={styles.imageWrapper}>
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          backgroundColor: "var(--color-bg-tertiary)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "var(--color-text-tertiary)",
                          fontSize: "var(--font-size-sm)",
                        }}
                      >
                        No Image
                      </div>
                    </div>
                  )}
                  <div className={styles.content}>
                    {(product.name || product.title) && (
                      <h3 className={styles.name}>
                        {product.slug ? (
                          <Link href={`/products/${product.slug}`}>
                            {product.name || product.title}
                          </Link>
                        ) : (
                          product.name || product.title
                        )}
                      </h3>
                    )}
                    {product.price && (
                      <div className={styles.price}>{product.price}</div>
                    )}
                    {product.slug ? (
                      <Button
                        as="a"
                        href={`/products/${product.slug}`}
                        variant="secondary"
                        className={styles.button}
                      >
                        View Product
                      </Button>
                    ) : (
                      <Button variant="secondary" className={styles.button}>
                        Add to cart
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "var(--spacing-3xl) 0" }}>
            <p
              style={{
                color: "var(--color-text-secondary)",
                marginBottom: "var(--spacing-md)",
              }}
            >
              No products available at this time.
            </p>
            {featuredProductsSource &&
              Array.isArray(featuredProductsSource) &&
              featuredProductsSource.length > 0 && (
                <p
                  style={{
                    fontSize: "var(--font-size-sm)",
                    color: "var(--color-text-tertiary)",
                  }}
                >
                  Source: {featuredProductsSource.join(", ")}
                </p>
              )}
          </div>
        )}
      </Container>
    </section>
  );
}
