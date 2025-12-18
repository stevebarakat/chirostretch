import { ReactNode, AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";
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
  ButtonHTMLAttributes<HTMLButtonElement> & {
    as?: "button";
  };

type LinkButtonProps = BaseButtonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    as: "a";
    href: string;
  };

type ButtonComponentProps = ButtonProps | LinkButtonProps;

export default function Button(props: ButtonComponentProps) {
  const {
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
    ...rest
  } = props;
  const isLink = "as" in props && props.as === "a";

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
        <span className={styles.icon}>{icon}</span>
      )}
      {children}
      {icon && iconPosition === "right" && (
        <span className={styles.icon}>{icon}</span>
      )}
    </>
  );

  if (isLink) {
    const { as, ...linkProps } = rest as LinkButtonProps;
    void as;
    return (
      <a className={buttonClasses} style={glassStyles} {...linkProps}>
        {content}
      </a>
    );
  }

  const buttonProps = rest as Omit<
    ButtonProps,
    | "as"
    | "color"
    | "variant"
    | "outline"
    | "fullWidth"
    | "shadow"
    | "blur"
    | "icon"
    | "iconPosition"
    | "children"
    | "className"
  >;
  return (
    <button
      type="button"
      className={buttonClasses}
      style={glassStyles}
      {...buttonProps}
    >
      {content}
    </button>
  );
}
