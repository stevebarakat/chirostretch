import { ReactNode, AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";
import { clsx } from "clsx";
import styles from "./Button.module.css";

type BaseButtonProps = {
  color?: "primary" | "secondary" | "tertiary" | "black" | "white" | "warning";
  variant?: "default" | "inverse" | "outline" | "glass";
  fullWidth?: boolean;
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
    variant = "default",
    fullWidth = false,
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
    styles[variant],
    fullWidth && styles.fullWidth,
    className
  );

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
      <a className={buttonClasses} {...linkProps}>
        {content}
      </a>
    );
  }

  const buttonProps = rest as Omit<
    ButtonProps,
    | "as"
    | "color"
    | "variant"
    | "icon"
    | "iconPosition"
    | "children"
    | "className"
  >;
  return (
    <button type="button" className={buttonClasses} {...buttonProps}>
      {content}
    </button>
  );
}
