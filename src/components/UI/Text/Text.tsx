import { type ReactNode, type HTMLAttributes, type Ref } from "react";
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

type TextProps = HTMLAttributes<HTMLElement> & {
  as?: TextElement;
  children: ReactNode;
  size?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
  weight?: "normal" | "medium" | "semibold" | "bold";
  color?: "primary" | "secondary" | "inverse" | "muted";
  align?: "left" | "center" | "right";
  ref?: Ref<HTMLElement>;
};

function Text({
  as = "p",
  children,
  className,
  size,
  weight,
  color,
  align,
  ref,
  ...props
}: TextProps) {
  const textClasses = clsx(
    styles.text,
    size && styles[`size-${size}`],
    weight && styles[`weight-${weight}`],
    color && styles[`color-${color}`],
    align && styles[`align-${align}`],
    className
  );

  const commonProps = { className: textClasses, ...props };

  switch (as) {
    case "span":
      return <span ref={ref as Ref<HTMLSpanElement>} {...commonProps}>{children}</span>;
    case "h1":
      return <h1 ref={ref as Ref<HTMLHeadingElement>} {...commonProps}>{children}</h1>;
    case "h2":
      return <h2 ref={ref as Ref<HTMLHeadingElement>} {...commonProps}>{children}</h2>;
    case "h3":
      return <h3 ref={ref as Ref<HTMLHeadingElement>} {...commonProps}>{children}</h3>;
    case "h4":
      return <h4 ref={ref as Ref<HTMLHeadingElement>} {...commonProps}>{children}</h4>;
    case "h5":
      return <h5 ref={ref as Ref<HTMLHeadingElement>} {...commonProps}>{children}</h5>;
    case "h6":
      return <h6 ref={ref as Ref<HTMLHeadingElement>} {...commonProps}>{children}</h6>;
    case "label":
      return <label ref={ref as Ref<HTMLLabelElement>} {...commonProps}>{children}</label>;
    case "strong":
      return <strong ref={ref as Ref<HTMLElement>} {...commonProps}>{children}</strong>;
    case "em":
      return <em ref={ref as Ref<HTMLElement>} {...commonProps}>{children}</em>;
    default:
      return <p ref={ref as Ref<HTMLParagraphElement>} {...commonProps}>{children}</p>;
  }
}

export default Text;
