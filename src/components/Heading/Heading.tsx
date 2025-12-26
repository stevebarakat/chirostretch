// Wildcard import needed for React namespace types (ComponentPropsWithoutRef, ReactNode, etc.)
// Note: useEffect is NOT used in this file - this import is only for type definitions
// eslint-disable-next-line no-restricted-imports
import * as React from "react";

type HeadingElement = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

type HeadingProps<T extends HeadingElement = "h1"> = Omit<
  React.ComponentPropsWithoutRef<T>,
  "children"
> & {
  as?: T;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
  ref?: React.ComponentPropsWithRef<T>["ref"];
};

function Heading<T extends HeadingElement = "h1">({
  as,
  level = 1,
  children,
  ref,
  ...props
}: HeadingProps<T>) {
  const Component = (as ?? (`h${level}` as HeadingElement)) as T;

  return (
    <Component ref={ref} {...props}>
      {children}
    </Component>
  );
}

export default Heading;

