import type { Block } from "../BlockRenderer";
import styles from "./AccordionBlock.module.css";

type AccordionBlockProps = {
  block: Block;
};

function extractText(block: Block): string {
  if (block.attributes?.text) return block.attributes.text as string;
  if (block.attributes?.content) return block.attributes.content as string;
  if (block.innerHTML) return block.innerHTML.replace(/<[^>]*>/g, "");

  if (block.innerBlocks?.length) {
    return block.innerBlocks.map(extractText).join(" ");
  }

  return "";
}

function findHeading(blocks: Block[]): string {
  for (const block of blocks) {
    if (
      block.name === "stackable/heading" ||
      block.name === "core/heading" ||
      block.name === "core/paragraph"
    ) {
      const text = extractText(block);
      if (text) return text;
    }
    if (block.innerBlocks?.length) {
      const found = findHeading(block.innerBlocks);
      if (found) return found;
    }
  }
  return "Accordion";
}

function findContent(blocks: Block[]): Block[] {
  for (const block of blocks) {
    const className = block.attributes?.className as string | undefined;
    if (className?.includes("stk-block-accordion__content")) {
      return block.innerBlocks || [];
    }
    if (block.innerBlocks?.length) {
      const found = findContent(block.innerBlocks);
      if (found.length) return found;
    }
  }
  return [];
}

function RenderContent({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((block, index) => {
        const text = extractText(block);
        if (text) {
          return <p key={index}>{text}</p>;
        }
        if (block.innerBlocks?.length) {
          return <RenderContent key={index} blocks={block.innerBlocks} />;
        }
        return null;
      })}
    </>
  );
}

export default function AccordionBlock({ block }: AccordionBlockProps) {
  const innerBlocks = block.innerBlocks || [];
  const heading = findHeading(innerBlocks);
  const contentBlocks = findContent(innerBlocks);

  return (
    <details className={styles.accordion}>
      <summary className={styles.summary}>{heading}</summary>
      <div className={styles.content}>
        <RenderContent blocks={contentBlocks} />
      </div>
    </details>
  );
}
