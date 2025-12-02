import type { ComponentProps } from "react";
import styles from "./button.module.css";

type ButtonProps = ComponentProps<"button"> & {
  textColor: string;
  children: React.ReactNode;
  borderColor?: string;
  width?: string;
  color: string;
};

export default function Button({
  color,
  borderColor,
  textColor,
  children,
  width,
  ...props
}: ButtonProps) {
  return (
    <button
      className={styles.button}
      style={{
        color: textColor,
        background: color,
        borderRadius: "4px",
        textAlign: "center",
        border: "1px solid " + borderColor || "none",
        width: width || "auto",
      }}
      {...props}
    >
      {children}
    </button>
  );
}
