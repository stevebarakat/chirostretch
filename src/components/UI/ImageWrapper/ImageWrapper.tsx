import * as React from "react";
import { ReactNode } from "react";
import { clsx } from "clsx";
import styles from "./ImageWrapper.module.css";

type ImageWrapperProps = React.HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  ref?: React.Ref<HTMLDivElement>;
};

export function ImageWrapper({
  children,
  className,
  ref,
  ...props
}: ImageWrapperProps) {
  return (
    <div
      ref={ref}
      className={clsx(styles.imageWrapper, className)}
      {...props}
    >
      {children}
    </div>
  );
}
