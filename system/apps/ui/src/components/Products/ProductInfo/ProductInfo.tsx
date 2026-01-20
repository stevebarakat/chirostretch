"use client";

// eslint-disable-next-line no-restricted-imports
import { useState } from "react";
import { Button, Input, Text } from "@/components/Primitives";
import { useCartStore } from "@/stores/useCartStore";
import { toast } from "@/lib/toast";
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

type SimpleProduct = BaseProduct & { __typename?: "SimpleProduct" };
type VariableProduct = BaseProduct & {
  __typename?: "VariableProduct";
  variations?: { nodes?: ProductVariation[] };
};
type ExternalProduct = BaseProduct & {
  __typename?: "ExternalProduct";
  externalUrl?: string;
  buttonText?: string;
};
type GroupProduct = BaseProduct & { __typename?: "GroupProduct" };

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
      console.error("Cannot add to cart: missing databaseId", product);
      toast.error("Unable to add this item to cart.");
      return;
    }

    try {
      // Pass product data to cart store so it has name and price
      await addToCart(product.databaseId, quantity, {
        name: product.name || "Product",
        prices: {
          price: displayPrice || "0",
          regular_price: product.regularPrice,
          sale_price: product.salePrice,
        },
      });
      toast.success(`Added ${product.name || "item"} to cart`);
    } catch (error) {
      console.error("Failed to add product to cart:", error);
      toast.error("Failed to add to cart. Please try again.");
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
      <Text as="h1" className={styles.title}>{product.name}</Text>

      <div className={styles.priceSection}>
        {displayPrice && (
          <div className={styles.price}>
            <Text as="span" className={isOnSale ? styles.salePrice : styles.regularPrice}>
              {formatPrice(displayPrice)}
            </Text>
            {isOnSale && product.regularPrice && (
              <Text as="span" className={styles.originalPrice}>
                {formatPrice(product.regularPrice)}
              </Text>
            )}
          </div>
        )}
        {isOnSale && <Text as="span" className={styles.saleBadge}>On Sale</Text>}
      </div>

      {product.shortDescription && (
        <div
          className={styles.shortDescription}
          dangerouslySetInnerHTML={{ __html: product.shortDescription }}
        />
      )}

      <div className={styles.actions}>
        {isExternal && product.externalUrl ? (
          <Button
            as="a"
            href={product.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.button}
          >
            {product.buttonText || "Buy Now"}
          </Button>
        ) : (
          <>
            <div className={styles.quantityWrapper}>
              <Text as="label" htmlFor="quantity" className={styles.quantityLabel}>
                Quantity
              </Text>
              <Input
                id="quantity"
                type="number"
                min={1}
                value={quantity}
                onChange={handleQuantityChange}
                size="md"
                className={styles.quantityInput}
                disabled={!isInStock}
              />
            </div>

            <Button
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

            <Button
              as="a"
              href="/cart"
              className={styles.viewCartButton}
              color="secondary"
            >
              View Cart
            </Button>
          </>
        )}
      </div>

      <div className={styles.metadata}>
        {product.sku && (
          <Text as="span" className={styles.metadataItem}>
            <Text as="strong">SKU:</Text> {product.sku}
          </Text>
        )}

        {product.productCategories?.nodes &&
          product.productCategories.nodes.length > 0 && (
            <Text as="span" className={styles.metadataItem}>
              <Text as="strong">Category: </Text>
              {product.productCategories.nodes.map((category, index) => (
                <Text as="span" key={category.id || index}>
                  {index > 0 && ", "}
                  <a
                    href={`/category/${category.slug}`}
                    className={styles.metadataLink}
                  >
                    {category.name}
                  </a>
                </Text>
              ))}
            </Text>
          )}

        {product.productTags?.nodes && product.productTags.nodes.length > 0 && (
          <Text as="span" className={styles.metadataItem}>
            <Text as="strong">Tag:</Text>{" "}
            {product.productTags.nodes.map((tag, index) => (
              <Text as="span" key={tag.id || index}>
                {index > 0 && ", "}
                <a href={`/tag/${tag.slug}`} className={styles.metadataLink}>
                  {tag.name}
                </a>
              </Text>
            ))}
          </Text>
        )}
      </div>

      {!isInStock && (
        <div className={styles.stockStatus}>
          <Text as="span" className={styles.outOfStock}>Out of Stock</Text>
        </div>
      )}

      {isVariable &&
        product.attributes?.nodes &&
        product.attributes.nodes.length > 0 && (
          <div className={styles.attributes}>
            {product.attributes.nodes.map((attr, index) => (
              <div key={attr.id || index} className={styles.attribute}>
                <Text as="strong">{attr.name}:</Text>{" "}
                {attr.options?.join(", ") || "N/A"}
              </div>
            ))}
          </div>
        )}

      {isVariable && "variations" in product && product.variations?.nodes && (
        <div className={styles.variations}>
          <Text as="strong">Available Variations:</Text>
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

      <Button
        as="a"
        href="/shop"
        className={styles.continueShoppingButton}
        color="primary"
        variant="inverse outline"
      >
        Continue Shopping
      </Button>
    </div>
  );
}
