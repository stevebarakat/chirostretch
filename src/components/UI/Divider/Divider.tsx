import { type HTMLAttributes, type Ref } from "react";
import { clsx } from "clsx";
import styles from "./Divider.module.css";

type DividerProps = HTMLAttributes<HTMLHRElement> & {
  orientation?: "horizontal" | "vertical";
  thickness?: "thin" | "medium" | "thick";
  color?: "primary" | "secondary" | "neutral" | "muted";
  spacing?: "none" | "sm" | "md" | "lg" | "xl";
  ref?: Ref<HTMLHRElement>;
};

function Divider({
  orientation = "horizontal",
  thickness = "thin",
  color = "neutral",
  spacing = "md",
  className,
  ref,
  ...props
}: DividerProps) {
  const dividerClasses = clsx(
    styles.divider,
    styles[orientation],
    styles[`thickness-${thickness}`],
    styles[`color-${color}`],
    spacing !== "none" && styles[`spacing-${spacing}`],
    className
  );

  return <hr ref={ref} className={dividerClasses} {...props} />;
}

export default Divider;

