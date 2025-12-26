// Wildcard import needed for React namespace types (ComponentPropsWithoutRef, ComponentPropsWithRef, etc.)
// Note: useEffect is NOT used in this file - this import is only for type definitions
// eslint-disable-next-line no-restricted-imports
import * as React from "react";
import { ReactNode } from "react";
import { clsx } from "clsx";
import styles from "./Text.module.css";

type TextElement =
  | "p"
  | "span"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "label"
  | "strong"
  | "em";

type BaseTextProps = {
  as?: TextElement;
  children: ReactNode;
  className?: string;
  size?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
  weight?: "normal" | "medium" | "semibold" | "bold";
  color?: "primary" | "secondary" | "inverse" | "muted";
  align?: "left" | "center" | "right";
};

type TextProps<T extends TextElement = "p"> = BaseTextProps &
  Omit<React.ComponentPropsWithoutRef<T>, keyof BaseTextProps> & {
    as?: T;
    ref?: React.ComponentPropsWithRef<T>["ref"];
  };

function Text<T extends TextElement = "p">({
  as,
  children,
  className,
  size,
  weight,
  color,
  align,
  ref,
  ...props
}: TextProps<T>) {
  const Component = (as ?? "p") as T;

  const textClasses = clsx(
    styles.text,
    size && styles[`size-${size}`],
    weight && styles[`weight-${weight}`],
    color && styles[`color-${color}`],
    align && styles[`align-${align}`],
    className
  );

  return (
    <Component ref={ref} className={textClasses} {...props}>
      {children}
    </Component>
  );
}

export default Text;

