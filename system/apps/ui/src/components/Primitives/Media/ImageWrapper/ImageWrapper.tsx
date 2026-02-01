import type { HTMLAttributes, ReactNode, Ref } from "react";
import { clsx } from "clsx";
import styles from "./ImageWrapper.module.css";

type ImageWrapperProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  ref?: Ref<HTMLDivElement>;
};

export function ImageWrapper({
  children,
  className,
  ref,
  ...props
}: ImageWrapperProps) {
  return (
    <div ref={ref} className={clsx(styles.imageWrapper, className)} {...props}>
      {children}
    </div>
  );
}
