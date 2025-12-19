import { ReactNode, HTMLAttributes, forwardRef } from "react";
import { clsx } from "clsx";
import styles from "./ImageWrapper.module.css";

type ImageWrapperProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export const ImageWrapper = forwardRef<HTMLDivElement, ImageWrapperProps>(
  function ImageWrapper({ children, className, ...props }, ref) {
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
);
