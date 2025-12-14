import { ReactNode, AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";
import styles from "./Button.module.css";

type BaseButtonProps = {
  variant?: "primary" | "secondary" | "warning" | "outline" | "white";
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
    variant = "primary",
    fullWidth = false,
    icon,
    iconPosition = "right",
    children,
    className = "",
    ...rest
  } = props;
  const isLink = "as" in props && props.as === "a";

  const buttonClasses = `${styles.button} ${styles[variant]} ${
    fullWidth ? styles.fullWidth : ""
  } ${className}`.trim();

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
    "as" | "variant" | "icon" | "iconPosition" | "children" | "className"
  >;
  return (
    <button type="button" className={buttonClasses} {...buttonProps}>
      {content}
    </button>
  );
}
