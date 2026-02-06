import { parseHtml } from "../parseHtml";
import styles from "./ParagraphBlock.module.css";

type ParagraphBlockProps = {
  content: string;
  className?: string;
};

export default function ParagraphBlock({
  content,
  className,
}: ParagraphBlockProps) {
  if (!content) return null;

  const combinedClassName = className
    ? `${styles.paragraph} ${className}`
    : styles.paragraph;

  return <div className={combinedClassName}>{parseHtml(content)}</div>;
}
