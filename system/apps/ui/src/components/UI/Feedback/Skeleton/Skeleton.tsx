import { clsx } from "clsx";
import styles from "./Skeleton.module.css";

type SkeletonProps = {
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  className?: string;
};

export function Skeleton({
  width,
  height,
  borderRadius,
  className,
}: SkeletonProps) {
  return (
    <div
      className={clsx(styles.skeleton, className)}
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
        borderRadius,
      }}
      aria-hidden="true"
    />
  );
}

type SkeletonTextProps = {
  lines?: number;
  className?: string;
};

export function SkeletonText({ lines = 3, className }: SkeletonTextProps) {
  return (
    <div className={clsx(styles.textContainer, className)} aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={styles.skeleton}
          style={{
            width: i === lines - 1 ? "60%" : "100%",
            height: "1em",
          }}
        />
      ))}
    </div>
  );
}
