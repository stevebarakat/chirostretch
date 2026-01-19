// Wildcard import needed for React namespace types (ComponentPropsWithoutRef, Ref, etc.)
// Note: useEffect is NOT used in this file - this import is only for type definitions
// eslint-disable-next-line no-restricted-imports
import * as React from "react";
import { ReactNode } from "react";
import Link from "next/link";
import { clsx } from "clsx";
import styles from "./Button.module.css";

type BaseButtonProps = {
  color?: "primary" | "secondary" | "neutral" | "glass";
  variant?: "inverse" | "outline" | "inverse outline" | "outline inverse";
  size?: "xs" | "sm" | "md" | "lg";
  outline?: boolean;
  fullWidth?: boolean;
  shadow?: boolean;
  blur?: number;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  children?: ReactNode;
  className?: string;
  "aria-label"?: string;
};

type ButtonProps = BaseButtonProps &
  Omit<
    React.ComponentPropsWithoutRef<"button">,
    keyof BaseButtonProps | "type"
  > & {
    as?: "button";
    ref?: React.Ref<HTMLButtonElement>;
    type?: React.ButtonHTMLAttributes<HTMLButtonElement>["type"];
  };

type LinkButtonProps = BaseButtonProps &
  Omit<React.ComponentPropsWithoutRef<"a">, keyof BaseButtonProps> & {
    as: "a";
    href: string;
    ref?: React.Ref<HTMLAnchorElement>;
  };

type NextLinkButtonProps = BaseButtonProps &
  Omit<React.ComponentPropsWithoutRef<typeof Link>, keyof BaseButtonProps> & {
    as: "Link";
    href: string;
    ref?: React.Ref<HTMLAnchorElement>;
  };

type ButtonComponentProps = ButtonProps | LinkButtonProps | NextLinkButtonProps;

function Button({
  as,
  color = "primary",
  variant,
  size = "md",
  outline = false,
  fullWidth = false,
  shadow = false,
  blur = 0,
  icon,
  iconPosition = "right",
  children,
  className = "",
  "aria-label": ariaLabel,
  ref,
  ...props
}: ButtonComponentProps) {
  const Component = as ?? "button";
  const isIconOnly = icon && !children;

  const variantClasses = variant
    ? variant.split(" ").map((v) => styles[v.trim()]).filter(Boolean)
    : [];

  const buttonClasses = clsx(
    styles.button,
    styles[color],
    styles[size],
    ...variantClasses,
    outline && styles.outlineBorder,
    fullWidth && styles.fullWidth,
    shadow && styles.shadow,
    isIconOnly && styles.iconOnly,
    className
  );

  const glassStyles =
    color === "glass"
      ? {
          backdropFilter: `blur(${blur}px) saturate(180%)`,
        }
      : undefined;

  const content = (
    <>
      {icon && iconPosition === "left" && (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
      {icon && iconPosition === "right" && (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      )}
    </>
  );

  if (Component === "Link") {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { as: _as, ...linkProps } = props as NextLinkButtonProps;
    return (
      <Link
        ref={ref as React.Ref<HTMLAnchorElement>}
        className={buttonClasses}
        style={glassStyles}
        aria-label={ariaLabel}
        {...linkProps}
      >
        {content}
      </Link>
    );
  }

  if (Component === "a") {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { as: _as, ...linkProps } = props as LinkButtonProps;
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        className={buttonClasses}
        style={glassStyles}
        aria-label={ariaLabel}
        {...linkProps}
      >
        {content}
      </a>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { as: _as, type, ...buttonProps } = props as ButtonProps;
  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      type={type ?? "button"}
      className={buttonClasses}
      style={glassStyles}
      aria-label={ariaLabel}
      {...buttonProps}
    >
      {content}
    </button>
  );
}

export default Button;
