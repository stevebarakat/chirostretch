import * as React from "react";
import { ReactNode } from "react";
import { clsx } from "clsx";
import styles from "./Button.module.css";

type BaseButtonProps = {
  color?: "primary" | "secondary" | "neutral" | "glass";
  variant?: "inverse" | "outline";
  outline?: boolean;
  fullWidth?: boolean;
  shadow?: boolean;
  blur?: number;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  children: ReactNode;
  className?: string;
};

type ButtonProps = BaseButtonProps &
  Omit<React.ComponentPropsWithoutRef<"button">, keyof BaseButtonProps | "type"> & {
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

function Button(props: ButtonProps): React.ReactElement;
function Button(props: LinkButtonProps): React.ReactElement;
function Button({
  as,
  color = "primary",
  variant,
  outline = false,
  fullWidth = false,
  shadow = false,
  blur = 0,
  icon,
  iconPosition = "right",
  children,
  className = "",
  ref,
  ...props
}: ButtonProps | LinkButtonProps) {
  const Component = as ?? "button";

  const buttonClasses = clsx(
    styles.button,
    styles[color],
    variant && styles[variant],
    outline && styles.outlineBorder,
    fullWidth && styles.fullWidth,
    shadow && styles.shadow,
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
        <span className={styles.icon} tabIndex={-1} aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
      {icon && iconPosition === "right" && (
        <span className={styles.icon} tabIndex={-1} aria-hidden="true">
          {icon}
        </span>
      )}
    </>
  );

  if (Component === "a") {
    const { as: _as, ...linkProps } = props as LinkButtonProps;
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        className={buttonClasses}
        style={glassStyles}
        {...linkProps}
      >
        {content}
      </a>
    );
  }

  const { as: _as, type, ...buttonProps } = props as ButtonProps;
  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      type={type ?? "button"}
      className={buttonClasses}
      style={glassStyles}
      {...buttonProps}
    >
      {content}
    </button>
  );
}

export default Button;
