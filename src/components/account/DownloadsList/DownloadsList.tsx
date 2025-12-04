import Link from "next/link";
import type { DownloadableItem } from "@/lib/graphql/queries/account";
import styles from "./DownloadsList.module.css";

type DownloadsListProps = {
  downloads: DownloadableItem[];
};

export function DownloadsList({ downloads }: DownloadsListProps) {
  if (downloads.length === 0) {
    return (
      <div className={styles.empty}>
        <p>No downloads available.</p>
        <Link href="/shop" className={styles.shopLink}>
          Browse products
        </Link>
      </div>
    );
  }

  const formatExpiry = (expiry?: string | null): string => {
    if (!expiry) return "Never expires";
    try {
      const date = new Date(expiry);
      if (date.getTime() > Date.now()) {
        return `Expires ${date.toLocaleDateString("en-US")}`;
      }
      return "Expired";
    } catch {
      return "Never expires";
    }
  };

  return (
    <div className={styles.list}>
      {downloads.map((item, index) => (
        <div key={index} className={styles.item}>
          <div className={styles.itemHeader}>
            <h3 className={styles.productName}>
              {item.product?.node?.name || "Unknown Product"}
            </h3>
            {item.product?.node?.slug && (
              <Link
                href={`/products/${item.product.node.slug}`}
                className={styles.productLink}
              >
                View Product
              </Link>
            )}
          </div>

          {item.download && (
            <div className={styles.downloadInfo}>
              <div className={styles.downloadMeta}>
                <span className={styles.downloadName}>
                  {item.download.name || "Download"}
                </span>
                <div className={styles.downloadDetails}>
                  {typeof item.downloadsRemaining === "number" && (
                    <span className={styles.remaining}>
                      {item.downloadsRemaining} downloads remaining
                    </span>
                  )}
                  <span className={styles.expiry}>
                    {formatExpiry(item.accessExpires)}
                  </span>
                </div>
              </div>

              {item.download.file && (
                <a
                  href={item.download.file}
                  download
                  className={styles.downloadButton}
                >
                  Download
                </a>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
