import Link from "next/link";
import styles from "./Pagination.module.css";

type PaginationProps = {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  endCursor?: string | null;
  startCursor?: string | null;
  currentPath: string;
};

export default function Pagination({
  hasNextPage,
  hasPreviousPage,
  endCursor,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  startCursor: _startCursor,
  currentPath,
}: PaginationProps) {
  if (!hasNextPage && !hasPreviousPage) {
    return null;
  }

  const nextUrl =
    hasNextPage && endCursor
      ? `${currentPath}?after=${encodeURIComponent(endCursor)}`
      : null;

  const previousUrl = hasPreviousPage ? currentPath : null;

  return (
    <nav className={styles.pagination} aria-label="Pagination">
      <div className={styles.controls}>
        {previousUrl ? (
          <Link href={previousUrl} className={styles.button}>
            Previous
          </Link>
        ) : (
          <span className={`${styles.button} ${styles.disabled}`}>
            Previous
          </span>
        )}
        {nextUrl ? (
          <Link href={nextUrl} className={styles.button}>
            Next
          </Link>
        ) : (
          <span className={`${styles.button} ${styles.disabled}`}>Next</span>
        )}
      </div>
    </nav>
  );
}
