"use client";

import { useState } from "react";
import Button from "@components/ui/Button";
import { useCartStore } from "@/lib/useCartStore";
import styles from "./ProductInfo.module.css";

type ProductVariation = {
  id?: string;
  databaseId?: number;
  price?: string;
  regularPrice?: string;
  salePrice?: string;
  stockStatus?: string;
  attributes?: {
    nodes?: Array<{
      name?: string;
      value?: string;
    }>;
  };
};

type ProductAttribute = {
  id?: string;
  name?: string;
  options?: string[];
  variation?: boolean;
};

type ProductCategory = {
  id?: string;
  name?: string;
  slug?: string;
};

type ProductTag = {
  id?: string;
  name?: string;
  slug?: string;
};

type BaseProduct = {
  id?: string;
  databaseId?: number;
  name?: string;
  slug?: string;
  sku?: string;
  description?: string;
  shortDescription?: string;
  stockStatus?: string;
  price?: string;
  regularPrice?: string;
  salePrice?: string;
  attributes?: {
    nodes?: ProductAttribute[];
  };
  productCategories?: {
    nodes?: ProductCategory[];
  };
  productTags?: {
    nodes?: ProductTag[];
  };
  __typename?: string;
};

type SimpleProduct = BaseProduct & {
  __typename?: "SimpleProduct";
};

type VariableProduct = BaseProduct & {
  __typename?: "VariableProduct";
  variations?: {
    nodes?: ProductVariation[];
  };
};

type ExternalProduct = BaseProduct & {
  __typename?: "ExternalProduct";
  externalUrl?: string;
  buttonText?: string;
};

type GroupProduct = BaseProduct & {
  __typename?: "GroupProduct";
};

type ProductInfoProps = {
  product: SimpleProduct | VariableProduct | ExternalProduct | GroupProduct;
};

export default function ProductInfo({ product }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const addToCart = useCartStore((state) => state.addToCart);
  const loading = useCartStore((state) => state.loading);
  const isOnSale =
    product.salePrice && product.salePrice !== product.regularPrice;
  const displayPrice =
    product.salePrice || product.price || product.regularPrice;
  const isInStock = product.stockStatus === "IN_STOCK";
  const isVariable = product.__typename === "VariableProduct";
  const isExternal = product.__typename === "ExternalProduct";

  const handleAddToCart = async () => {
    if (!product.databaseId) {
      console.error(
        "Cannot add to cart: product databaseId is missing",
        product
      );
      return;
    }

    console.log(
      "Adding product to cart:",
      product.databaseId,
      product.name,
      "quantity:",
      quantity
    );

    try {
      await addToCart(product.databaseId, quantity);
      console.log("Successfully added to cart");
    } catch (error) {
      console.error("Failed to add product to cart:", error);
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    }
  };

  const formatPrice = (price?: string) => {
    if (!price) return "";
    const numPrice = parseFloat(price.replace(/[^0-9.]/g, ""));
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(numPrice);
  };

  return (
    <div className={styles.info}>
      <h1 className={styles.title}>{product.name}</h1>

      <div className={styles.priceSection}>
        {displayPrice && (
          <div className={styles.price}>
            <span className={isOnSale ? styles.salePrice : styles.regularPrice}>
              {formatPrice(displayPrice)}
            </span>
            {isOnSale && product.regularPrice && (
              <span className={styles.originalPrice}>
                {formatPrice(product.regularPrice)}
              </span>
            )}
          </div>
        )}
        {isOnSale && <span className={styles.saleBadge}>On Sale</span>}
      </div>

      {product.shortDescription && (
        <div
          className={styles.shortDescription}
          dangerouslySetInnerHTML={{ __html: product.shortDescription }}
        />
      )}

      <div className={styles.actions}>
        {isExternal && "externalUrl" in product && product.externalUrl ? (
          <Button
            as="a"
            href={product.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            variant="primary"
            className={styles.button}
          >
            {product.buttonText || "Buy Now"}
          </Button>
        ) : (
          <>
            <div className={styles.quantityWrapper}>
              <label htmlFor="quantity" className={styles.quantityLabel}>
                Quantity
              </label>
              <input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={handleQuantityChange}
                className={styles.quantityInput}
                disabled={!isInStock}
              />
            </div>
            <Button
              variant="primary"
              className={styles.button}
              disabled={!isInStock || loading}
              onClick={handleAddToCart}
            >
              {loading
                ? "Adding..."
                : isInStock
                ? "Add to Cart"
                : "Out of Stock"}
            </Button>
          </>
        )}
      </div>

      <div className={styles.metadata}>
        {product.sku && (
          <span className={styles.metadataItem}>
            <strong>SKU:</strong> {product.sku}
          </span>
        )}
        {product.productCategories?.nodes &&
          product.productCategories.nodes.length > 0 && (
            <span className={styles.metadataItem}>
              <strong>Category:</strong>{" "}
              {product.productCategories.nodes.map((category, index) => (
                <span key={category.id || index}>
                  {index > 0 && ", "}
                  <a
                    href={`/category/${category.slug}`}
                    className={styles.metadataLink}
                  >
                    {category.name}
                  </a>
                </span>
              ))}
            </span>
          )}
        {product.productTags?.nodes && product.productTags.nodes.length > 0 && (
          <span className={styles.metadataItem}>
            <strong>Tag:</strong>{" "}
            {product.productTags.nodes.map((tag, index) => (
              <span key={tag.id || index}>
                {index > 0 && ", "}
                <a href={`/tag/${tag.slug}`} className={styles.metadataLink}>
                  {tag.name}
                </a>
              </span>
            ))}
          </span>
        )}
      </div>

      {!isInStock && (
        <div className={styles.stockStatus}>
          <span className={styles.outOfStock}>Out of Stock</span>
        </div>
      )}

      {isVariable &&
        product.attributes?.nodes &&
        product.attributes.nodes.length > 0 && (
          <div className={styles.attributes}>
            {product.attributes.nodes.map((attr, index) => (
              <div key={attr.id || index} className={styles.attribute}>
                <strong>{attr.name}:</strong>{" "}
                {attr.options?.join(", ") || "N/A"}
              </div>
            ))}
          </div>
        )}

      {isVariable && "variations" in product && product.variations?.nodes && (
        <div className={styles.variations}>
          <strong>Available Variations:</strong>
          <ul>
            {product.variations.nodes.map((variation) => (
              <li key={variation.id || variation.databaseId}>
                {variation.attributes?.nodes
                  ?.map((attr) => `${attr.name}: ${attr.value}`)
                  .join(", ") || "Default"}
                {variation.price && ` - ${formatPrice(variation.price)}`}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
