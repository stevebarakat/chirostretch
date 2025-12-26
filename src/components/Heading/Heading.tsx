import { type ReactNode, type HTMLAttributes, type Ref } from "react";

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

type HeadingProps = HTMLAttributes<HTMLHeadingElement> & {
  level?: HeadingLevel;
  children: ReactNode;
  ref?: Ref<HTMLHeadingElement>;
};

function Heading({ level = 1, children, ref, ...props }: HeadingProps) {
  const Tag = `h${level}` as const;

  switch (Tag) {
    case "h1":
      return (
        <h1 ref={ref} {...props}>
          {children}
        </h1>
      );
    case "h2":
      return (
        <h2 ref={ref} {...props}>
          {children}
        </h2>
      );
    case "h3":
      return (
        <h3 ref={ref} {...props}>
          {children}
        </h3>
      );
    case "h4":
      return (
        <h4 ref={ref} {...props}>
          {children}
        </h4>
      );
    case "h5":
      return (
        <h5 ref={ref} {...props}>
          {children}
        </h5>
      );
    case "h6":
      return (
        <h6 ref={ref} {...props}>
          {children}
        </h6>
      );
  }
}

export default Heading;
