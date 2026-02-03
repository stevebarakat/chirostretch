// Wildcard import needed for React namespace types (ComponentPropsWithoutRef, Ref, etc.)
// Note: useEffect is NOT used in this file - this import is only for type definitions
// eslint-disable-next-line no-restricted-imports
import * as React from "react";
import { clsx } from "clsx";
import styles from "./Input.module.css";

type InputElement = "input" | "textarea" | "select";

type BaseInputProps = {
  as?: InputElement;
  size?: "sm" | "md" | "lg";
  className?: string;
  error?: boolean;
};

type InputProps = BaseInputProps &
  Omit<React.ComponentPropsWithoutRef<"input">, keyof BaseInputProps> & {
    as?: "input";
    ref?: React.Ref<HTMLInputElement>;
  };

type TextareaProps = BaseInputProps &
  Omit<React.ComponentPropsWithoutRef<"textarea">, keyof BaseInputProps> & {
    as: "textarea";
    ref?: React.Ref<HTMLTextAreaElement>;
  };

type SelectProps = BaseInputProps &
  Omit<React.ComponentPropsWithoutRef<"select">, keyof BaseInputProps> & {
    as: "select";
    ref?: React.Ref<HTMLSelectElement>;
  };

type InputComponentProps = InputProps | TextareaProps | SelectProps;

function Input({
  as,
  size = "md",
  className,
  error,
  ref,
  ...props
}: InputComponentProps) {
  const Component = (as ?? "input") as InputElement;
  const fallbackId = React.useId();
  const providedId = "id" in props ? props.id : undefined;
  const providedName = "name" in props ? props.name : undefined;
  const id = providedId ?? (providedName ? undefined : fallbackId);

  const inputClasses = clsx(
    styles.input,
    Component === "textarea" && styles.textarea,
    Component === "select" && styles.select,
    Component !== "textarea" && styles[size],
    error && styles.error,
    className
  );

  const ariaInvalid = error === true ? true : undefined;

  if (Component === "textarea") {
    return (
      <textarea
        ref={ref as React.Ref<HTMLTextAreaElement>}
        className={inputClasses}
        aria-invalid={ariaInvalid}
        {...(props as React.ComponentPropsWithoutRef<"textarea">)}
        id={id}
      />
    );
  }

  if (Component === "select") {
    return (
      <select
        ref={ref as React.Ref<HTMLSelectElement>}
        className={inputClasses}
        aria-invalid={ariaInvalid}
        {...(props as React.ComponentPropsWithoutRef<"select">)}
        id={id}
      />
    );
  }

  return (
    <input
      ref={ref as React.Ref<HTMLInputElement>}
      className={inputClasses}
      aria-invalid={ariaInvalid}
      {...(props as React.ComponentPropsWithoutRef<"input">)}
      id={id}
    />
  );
}

export default Input;
