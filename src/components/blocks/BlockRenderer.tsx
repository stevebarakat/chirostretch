import ParagraphBlock from "./ParagraphBlock";
import HeadingBlock from "./HeadingBlock";
import ImageBlock from "./ImageBlock";

type Block = {
  name: string;
  attributes?: Record<string, unknown>;
  innerBlocks?: Block[];
  innerHTML?: string;
  innerContent?: string[];
};

type BlockRendererProps = {
  blocks: Block[];
  className?: string;
};

export default function BlockRenderer({
  blocks,
  className,
}: BlockRendererProps) {
  if (!blocks || blocks.length === 0) return null;

  return (
    <div className={className}>
      {blocks.map((block, index) => {
        const key = `block-${index}-${block.name}`;

        switch (block.name) {
          case "core/paragraph":
            return (
              <ParagraphBlock
                key={key}
                content={
                  block.innerHTML || (block.attributes?.content as string) || ""
                }
              />
            );

          case "core/heading":
            return (
              <HeadingBlock
                key={key}
                level={(block.attributes?.level as number) || 2}
                content={
                  block.innerHTML || (block.attributes?.content as string) || ""
                }
              />
            );

          case "core/image":
            const imageAttrs = block.attributes as {
              url?: string;
              alt?: string;
              width?: number;
              height?: number;
              caption?: string;
            };
            return (
              <ImageBlock
                key={key}
                url={imageAttrs?.url || ""}
                alt={imageAttrs?.alt || ""}
                width={imageAttrs?.width}
                height={imageAttrs?.height}
                caption={imageAttrs?.caption}
              />
            );

          case "core/columns":
          case "core/column":
          case "core/group":
            if (block.innerBlocks && block.innerBlocks.length > 0) {
              return <BlockRenderer key={key} blocks={block.innerBlocks} />;
            }
            return null;

          default:
            if (block.innerHTML) {
              return (
                <div
                  key={key}
                  dangerouslySetInnerHTML={{ __html: block.innerHTML }}
                />
              );
            }
            if (block.innerBlocks && block.innerBlocks.length > 0) {
              return <BlockRenderer key={key} blocks={block.innerBlocks} />;
            }
            return null;
        }
      })}
    </div>
  );
}
