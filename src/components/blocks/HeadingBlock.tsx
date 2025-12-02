import type { ReactNode } from "react";

type HeadingBlockProps = {
  level: number;
  content: string;
  className?: string;
};

export default function HeadingBlock({
  level,
  content,
  className,
}: HeadingBlockProps) {
  if (!content) return null;

  const HeadingTag = `h${Math.min(
    Math.max(level, 1),
    6
  )}` as keyof JSX.IntrinsicElements;

  return (
    <HeadingTag
      className={className}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
