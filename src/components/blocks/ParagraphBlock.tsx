import type { ReactNode } from "react";

type ParagraphBlockProps = {
  content: string;
  className?: string;
};

export default function ParagraphBlock({
  content,
  className,
}: ParagraphBlockProps) {
  if (!content) return null;

  return (
    <p className={className} dangerouslySetInnerHTML={{ __html: content }} />
  );
}
