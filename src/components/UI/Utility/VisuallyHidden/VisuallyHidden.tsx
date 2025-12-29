"use client";

// eslint-disable-next-line no-restricted-imports
import { ReactNode, useState, useEffect } from "react";
import styles from "./VisuallyHidden.module.css";

type VisuallyHiddenProps = {
  children: ReactNode;
  as?: "span" | "div";
} & React.HTMLAttributes<HTMLElement>;

export default function VisuallyHidden({
  children,
  as: Component = "span",
  ...delegated
}: VisuallyHiddenProps) {
  const [forceShow, setForceShow] = useState(false);

  // Reason this component must use useEffect:
  // - Syncing with external browser API (keyboard event listeners) in development mode
  // - Must subscribe/unsubscribe to window events for accessibility debugging
  // - This is a side effect that manages external system (browser event API)
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      function handleKeyDown(ev: KeyboardEvent) {
        if (ev.key === "Alt") {
          setForceShow(true);
        }
      }

      function handleKeyUp(ev: KeyboardEvent) {
        if (ev.key === "Alt") {
          setForceShow(false);
        }
      }

      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("keyup", handleKeyUp);

      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("keyup", handleKeyUp);
      };
    }
  }, []);

  if (forceShow) {
    return <Component {...delegated}>{children}</Component>;
  }

  return (
    <Component className={styles.visuallyHidden} {...delegated}>
      {children}
    </Component>
  );
}
