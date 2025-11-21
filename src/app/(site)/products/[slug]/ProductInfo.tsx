import Button from "@components/ui/Button";
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
  const isOnSale = product.salePrice && product.salePrice !== product.regularPrice;
  const displayPrice = product.salePrice || product.price || product.regularPrice;
  const isInStock = product.stockStatus === "IN_STOCK";
  const isVariable = product.__typename === "VariableProduct";
  const isExternal = product.__typename === "ExternalProduct";

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
      {product.productCategories?.nodes && product.productCategories.nodes.length > 0 && (
        <div className={styles.categories}>
          {product.productCategories.nodes.map((category, index) => (
            <span key={category.id || index} className={styles.category}>
              {category.name}
            </span>
          ))}
        </div>
      )}

      <h1 className={styles.title}>{product.name}</h1>

      {product.shortDescription && (
        <div
          className={styles.shortDescription}
          dangerouslySetInnerHTML={{ __html: product.shortDescription }}
        />
      )}

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
        {isOnSale && (
          <span className={styles.saleBadge}>On Sale</span>
        )}
      </div>

      {product.sku && (
        <div className={styles.sku}>
          <strong>SKU:</strong> {product.sku}
        </div>
      )}

      <div className={styles.stockStatus}>
        <span className={isInStock ? styles.inStock : styles.outOfStock}>
          {isInStock ? "In Stock" : "Out of Stock"}
        </span>
      </div>

      {product.attributes?.nodes && product.attributes.nodes.length > 0 && (
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
          <Button
            variant="primary"
            className={styles.button}
            disabled={!isInStock}
          >
            {isInStock ? "Add to Cart" : "Out of Stock"}
          </Button>
        )}
      </div>
    </div>
  );
}

