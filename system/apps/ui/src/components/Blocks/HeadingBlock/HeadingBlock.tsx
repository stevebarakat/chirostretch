import type { ElementType } from "react";
import { parseHtml } from "../parseHtml";

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

  const HeadingTag = `h${Math.min(Math.max(level, 1), 6)}` as ElementType;

  return <HeadingTag className={className}>{parseHtml(content)}</HeadingTag>;
}
