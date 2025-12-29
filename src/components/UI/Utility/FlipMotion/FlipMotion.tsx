"use client";

import { ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { clsx } from "clsx";
import styles from "./FlipMotion.module.css";

type FlipMotionProps = {
  children: ReactNode;
  className?: string;
  as?: "ul" | "ol" | "div";
  enableExit?: boolean;
};

export function FlipMotion({
  children,
  className,
  as = "ul",
  enableExit = true,
}: FlipMotionProps) {
  const MotionComponent = motion[as] as typeof motion.ul;

  return (
    <MotionComponent
      className={clsx(styles.list, className)}
      layout
      initial={false}
    >
      {enableExit ? (
        <AnimatePresence mode="popLayout">{children}</AnimatePresence>
      ) : (
        children
      )}
    </MotionComponent>
  );
}

type FlipMotionItemProps = {
  children?: ReactNode;
  className?: string;
  as?: "li" | "div";
  itemId?: string | number;
  initialOpacity?: number;
  animateOpacity?: number;
  exitOpacity?: number;
  ref?: React.Ref<HTMLLIElement>;
  "aria-hidden"?: boolean;
};

export function FlipMotionItem({
  children,
  className,
  as = "li",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  itemId: _itemId,
  initialOpacity = 0.5,
  animateOpacity = 1,
  exitOpacity = 0,
  ref,
  "aria-hidden": ariaHidden,
}: FlipMotionItemProps) {
  const MotionItem = motion[as] as typeof motion.li;

  return (
    <MotionItem
      ref={ref}
      className={clsx(styles.item, className)}
      layout
      initial={{ opacity: initialOpacity }}
      animate={{ opacity: animateOpacity }}
      exit={{ opacity: exitOpacity }}
      transition={{
        layout: { duration: 0.3, ease: "easeInOut" },
        opacity: { duration: 0.2 },
      }}
      aria-hidden={ariaHidden}
    >
      {children}
    </MotionItem>
  );
}

