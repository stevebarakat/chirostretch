"use client";

import Image from "next/image";
import Link from "next/link";
import { ImageWrapper, NoImage, StarRating, Button, Text } from "@/components/Primitives";
import { formatPrice } from "@/lib/utils/formatPrice";
import { useCartStore } from "@/stores/useCartStore";
import { toast } from "@/lib/toast";
import { rewriteImageUrl } from "@/utils/image-helpers";
import styles from "./ProductCard.module.css";

type ProductImage = {
  sourceUrl?: string;
  altText?: string;
  srcSet?: string;
  sizes?: string;
  mediaDetails?: {
    width?: number;
    height?: number;
  };
};

type ProductCardProps = {
  id?: string;
  databaseId?: number;
  name?: string;
  slug?: string;
  price?: string;
  regularPrice?: string;
  salePrice?: string;
  image?: ProductImage;
  featuredImage?: {
    node?: ProductImage;
  };
  averageRating?: number;
  reviewCount?: number;
  stockStatus?: string;
  variant?: "default" | "featured";
  priority?: boolean;
  className?: string;
};

export function ProductCard({
  id,
  databaseId,
  name,
  slug,
  price,
  regularPrice,
  salePrice,
  image,
  featuredImage,
  averageRating,
  reviewCount,
  stockStatus,
  variant = "default",
  priority = false,
  className,
}: ProductCardProps) {
  const addToCart = useCartStore((state) => state.addToCart);
  const loading = useCartStore((state) => state.loading);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!databaseId) {
      console.error("Cannot add to cart: missing databaseId");
      toast.error("Unable to add this item to cart.");
      return;
    }

    try {
      // Pass product data to cart store so it has name and price
      await addToCart(databaseId, 1, {
        name: name || "Product",
        prices: {
          price: displayPrice || "0",
          regular_price: regularPrice,
          sale_price: salePrice,
        },
      });
      toast.success(`Added ${name || "item"} to cart`);
    } catch (error) {
      console.error("Failed to add product to cart:", error);
      toast.error("Failed to add to cart. Please try again.");
    }
  };
  const productName = name || "Product";
  const productSlug = slug;
  const productId = id;

  const imageSource = image || featuredImage?.node;
  const imageUrl = rewriteImageUrl(imageSource?.sourceUrl);
  const hasValidImage = imageUrl.length > 0;
  const imageAlt = imageSource?.altText || productName;
  const imageSizes = imageSource?.sizes;
  const imageWidth = imageSource?.mediaDetails?.width;
  const imageHeight = imageSource?.mediaDetails?.height;

  const rating = averageRating ?? 0;
  const reviewCountValue = reviewCount ?? 0;

  const isOnSale = salePrice && regularPrice && salePrice !== regularPrice;
  const displayPrice = salePrice || price || regularPrice;
  const formattedPrice = displayPrice
    ? variant === "default"
      ? formatPrice(displayPrice)
      : displayPrice
    : null;

  const isOutOfStock = stockStatus === "OUT_OF_STOCK";
  const isInStock = stockStatus === "IN_STOCK" || stockStatus === undefined;

  const cardContent = (
    <>
      {hasValidImage ? (
        <ImageWrapper className={styles.imageWrapper}>
          <Image
            src={imageUrl}
            alt={imageAlt}
            {...(variant === "featured"
              ? {
                  fill: true,
                  sizes:
                    imageSizes ||
                    "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
                }
              : {
                  width: imageWidth || 400,
                  height: imageHeight || 400,
                  sizes:
                    "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
                })}
            quality={variant === "featured" ? 75 : undefined}
            className={styles.image}
            priority={priority}
            fetchPriority={priority ? "high" : "auto"}
          />
          {isOnSale && <Text as="span" className={styles.saleBadge}>Sale</Text>}
        </ImageWrapper>
      ) : (
        <ImageWrapper className={styles.imageWrapper}>
          <NoImage />
        </ImageWrapper>
      )}

      {variant === "featured" && (
        <div className={styles.overlay}>
          <div className={styles.overlayContent}>
            {productName && (
              <Text as="h3" className={styles.name}>{productName}</Text>
            )}
            <div className={styles.contentInner}>
              {(rating > 0 || reviewCountValue > 0) && (
                <div className={styles.rating}>
                  <StarRating rating={rating} reviewCount={reviewCountValue} />
                </div>
              )}
              {formattedPrice && (
                <div className={styles.price}>{formattedPrice}</div>
              )}
              {databaseId && (
                <Button
                  color="secondary"
                  variant="inverse"
                  className={styles.addToCartButton}
                  onClick={handleAddToCart}
                  disabled={!isInStock || loading}
                  aria-description={`Add ${productName} to cart`}
                >
                  {loading
                    ? "Adding..."
                    : isInStock
                    ? "Add to Cart"
                    : "Out of Stock"}
                </Button>
              )}
              {productSlug && !databaseId && (
                <Button
                  as="a"
                  href={`/shop/${productSlug}`}
                  color="secondary"
                  variant="inverse"
                  className={styles.viewItemButton}
                  aria-description={`View details for ${productName}`}
                >
                  View Item
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className={styles.content}>
        {productName && (
          <Text as="h3" className={variant === "featured" ? styles.name : styles.title}>
            {productName}
          </Text>
        )}

        {variant === "featured" ? (
          <div className={styles.ratingPriceRow}>
            {(rating > 0 || reviewCountValue > 0) && (
              <div className={styles.rating}>
                <StarRating rating={rating} reviewCount={reviewCountValue} />
              </div>
            )}
            {formattedPrice && (
              <div className={styles.price}>{formattedPrice}</div>
            )}
          </div>
        ) : (
          <>
            {formattedPrice && (
              <div className={styles.priceContainer}>
                {isOnSale && regularPrice && (
                  <Text as="span" className={styles.regularPrice}>
                    {formatPrice(regularPrice)}
                  </Text>
                )}
                <Text as="span" className={styles.price}>{formattedPrice}</Text>
              </div>
            )}
            {isOutOfStock && (
              <Text as="span" className={styles.outOfStock}>Out of Stock</Text>
            )}
          </>
        )}
      </div>
    </>
  );

  const cardClassName = [styles.card, styles[variant], className]
    .filter(Boolean)
    .join(" ");

  if (productSlug) {
    return (
      <Link
        href={`/shop/${productSlug}`}
        className={cardClassName}
        key={productId || productSlug}
      >
        {cardContent}
      </Link>
    );
  }

  return (
    <div className={cardClassName} key={productId}>
      {cardContent}
    </div>
  );
}
