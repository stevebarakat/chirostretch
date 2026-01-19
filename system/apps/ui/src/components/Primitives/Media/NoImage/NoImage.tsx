import { HTMLAttributes } from "react";
import { clsx } from "clsx";
import styles from "./NoImage.module.css";

type NoImageProps = HTMLAttributes<HTMLDivElement> & {
  text?: string;
  showIcon?: boolean;
};

export function NoImage({
  text = "No Image",
  showIcon = false,
  className,
  ...props
}: NoImageProps) {
  return (
    <div className={clsx(styles.noImage, className)} {...props}>
      {showIcon && (
        <svg
          className={styles.icon}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M9 9h6v6H9z" />
        </svg>
      )}
      <span className={styles.text}>{text}</span>
    </div>
  );
}

