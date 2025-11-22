import { ReactNode, AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";
import styles from "./Button.module.css";

type BaseButtonProps = {
  variant?: "primary" | "secondary" | "warning";
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
  const { variant = "primary", children, className = "", ...rest } = props;
  const isLink = "as" in props && props.as === "a";

  const buttonClasses =
    `${styles.button} ${styles[variant]} ${className}`.trim();

  if (isLink) {
    const { as, ...linkProps } = rest as LinkButtonProps;
    // 'as' is used for type narrowing but not needed in runtime
    void as;
    return (
      <a className={buttonClasses} {...linkProps}>
        {children}
      </a>
    );
  }

  const buttonProps = rest as Omit<
    ButtonProps,
    "as" | "variant" | "children" | "className"
  >;
  return (
    <button type="button" className={buttonClasses} {...buttonProps}>
      {children}
    </button>
  );
}
