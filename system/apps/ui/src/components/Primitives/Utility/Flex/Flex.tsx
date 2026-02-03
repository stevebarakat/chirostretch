import { type ReactNode, type HTMLAttributes, type Ref } from "react";
import { clsx } from "clsx";
import styles from "./Flex.module.css";

type FlexElement = "div" | "section" | "nav" | "header" | "footer" | "main";

type FlexProps = HTMLAttributes<HTMLElement> & {
  as?: FlexElement;
  children: ReactNode;
  direction?: "row" | "row-reverse" | "column" | "column-reverse";
  align?: "start" | "center" | "end" | "stretch" | "baseline";
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
  gap?: "0" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl";
  wrap?: "nowrap" | "wrap" | "wrap-reverse";
  ref?: Ref<HTMLElement>;
};

const directionClass: Record<NonNullable<FlexProps["direction"]>, string> = {
  row: styles.directionRow,
  "row-reverse": styles.directionRowReverse,
  column: styles.directionColumn,
  "column-reverse": styles.directionColumnReverse,
};

const alignClass: Record<NonNullable<FlexProps["align"]>, string> = {
  start: styles.alignStart,
  center: styles.alignCenter,
  end: styles.alignEnd,
  stretch: styles.alignStretch,
  baseline: styles.alignBaseline,
};

const justifyClass: Record<NonNullable<FlexProps["justify"]>, string> = {
  start: styles.justifyStart,
  center: styles.justifyCenter,
  end: styles.justifyEnd,
  between: styles.justifyBetween,
  around: styles.justifyAround,
  evenly: styles.justifyEvenly,
};

const gapClass: Record<NonNullable<FlexProps["gap"]>, string> = {
  "0": styles.gap0,
  xs: styles.gapXs,
  sm: styles.gapSm,
  md: styles.gapMd,
  lg: styles.gapLg,
  xl: styles.gapXl,
  "2xl": styles.gap2xl,
  "3xl": styles.gap3xl,
  "4xl": styles.gap4xl,
  "5xl": styles.gap5xl,
};

const wrapClass: Record<NonNullable<FlexProps["wrap"]>, string> = {
  nowrap: styles.wrapNowrap,
  wrap: styles.wrapWrap,
  "wrap-reverse": styles.wrapWrapReverse,
};

function Flex({
  as: Component = "div",
  children,
  className,
  direction,
  align,
  justify,
  gap,
  wrap,
  ref,
  ...props
}: FlexProps) {
  const flexClasses = clsx(
    styles.flex,
    direction && directionClass[direction],
    align && alignClass[align],
    justify && justifyClass[justify],
    gap !== undefined && gapClass[gap],
    wrap && wrapClass[wrap],
    className
  );
  return (
    <Component ref={ref as Ref<HTMLDivElement>} className={flexClasses} {...props}>
      {children}
    </Component>
  );
}

export default Flex;
