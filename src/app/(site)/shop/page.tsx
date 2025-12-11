import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
import PageHeader from "@/components/ui/PageHeader";
import { wpQuery } from "@/app/_lib/wp/graphql";
import {
  ALL_PRODUCTS_QUERY,
  type AllProductsResponse,
} from "@/lib/graphql/queries";
import { formatPrice } from "@/lib/utils/formatPrice";
import styles from "./page.module.css";

export const revalidate = 300;

export default async function ShopPage() {
  const data = await wpQuery<AllProductsResponse>(
    ALL_PRODUCTS_QUERY,
    { first: 100 },
    300
  );

  const products = data?.products?.nodes || [];

  return (
    <main className={styles.main}>
      <Container>
        <PageHeader title="Shop" subtitle="Browse our collection" showCart />
        {products.length > 0 ? (
          <div className={styles.grid}>
            {products.map((product) => {
              if (!product.slug) return null;

              const image = product.featuredImage?.node;
              const imageWidth = image?.mediaDetails?.width || 400;
              const imageHeight = image?.mediaDetails?.height || 400;
              const isOnSale =
                product.salePrice &&
                product.regularPrice &&
                product.salePrice !== product.regularPrice;
              const displayPrice =
                product.salePrice || product.price || product.regularPrice;

              return (
                <Link
                  key={product.id || product.slug}
                  href={`/products/${product.slug}`}
                  className={styles.card}
                >
                  {image?.sourceUrl ? (
                    <div className={styles.imageWrapper}>
                      <Image
                        src={image.sourceUrl}
                        alt={image.altText || product.name || "Product image"}
                        width={imageWidth}
                        height={imageHeight}
                        className={styles.image}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      {isOnSale && (
                        <span className={styles.saleBadge}>Sale</span>
                      )}
                    </div>
                  ) : (
                    <div className={styles.imageWrapper}>
                      <div className={styles.placeholder}>No Image</div>
                    </div>
                  )}
                  <div className={styles.content}>
                    <h3 className={styles.title}>{product.name}</h3>
                    <div className={styles.priceContainer}>
                      {isOnSale && product.regularPrice && (
                        <span className={styles.regularPrice}>
                          {formatPrice(product.regularPrice)}
                        </span>
                      )}
                      {displayPrice && (
                        <span className={styles.price}>
                          {formatPrice(displayPrice)}
                        </span>
                      )}
                    </div>
                    {product.stockStatus === "OUT_OF_STOCK" && (
                      <span className={styles.outOfStock}>Out of Stock</span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className={styles.empty}>
            <p>No products available at this time.</p>
          </div>
        )}
      </Container>
    </main>
  );
}
