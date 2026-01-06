import Link from "next/link";
import Image from "next/image";
import { ImageWrapper } from "@/components/UI";
import styles from "./RelatedProducts.module.css";

type RelatedProduct = {
  id?: string;
  name?: string;
  slug?: string;
  price?: string;
  featuredImage?: {
    node?: {
      sourceUrl?: string;
      altText?: string;
      mediaDetails?: {
        width?: number;
        height?: number;
      };
    };
  };
};

type RelatedProductsProps = {
  products: RelatedProduct[];
};

export default function RelatedProducts({ products }: RelatedProductsProps) {
  if (products.length === 0) {
    return null;
  }

  const formatPrice = (price?: string) => {
    if (!price) return "";
    const numPrice = parseFloat(price.replace(/[^0-9.]/g, ""));
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(numPrice);
  };

  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>Related Products</h2>
      <div className={styles.grid}>
        {products.map((product) => {
          if (!product.slug) return null;

          const image = product.featuredImage?.node;
          const imageWidth = image?.mediaDetails?.width || 400;
          const imageHeight = image?.mediaDetails?.height || 400;

          return (
            <Link
              key={product.id || product.slug}
              href={`/products/${product.slug}`}
              className={styles.card}
            >
              {image?.sourceUrl && (
                <ImageWrapper className={styles.imageWrapper}>
                  <Image
                    src={image.sourceUrl}
                    alt={image.altText || product.name || "Product image"}
                    width={imageWidth}
                    height={imageHeight}
                    className={styles.image}
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                </ImageWrapper>
              )}
              <div className={styles.content}>
                <h3 className={styles.title}>{product.name}</h3>
                {product.price && (
                  <div className={styles.price}>
                    {formatPrice(product.price)}
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

