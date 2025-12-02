import Image from "next/image";
import Container from "@/components/ui/Container";

type ImageBlockProps = {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
  caption?: string;
  className?: string;
};

export default function ImageBlock({
  url,
  alt = "",
  width,
  height,
  caption,
  className,
}: ImageBlockProps) {
  if (!url) return null;

  return (
    <figure className={className}>
      <Image
        src={url}
        alt={alt}
        width={width || 1200}
        height={height || 800}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
        style={{
          width: "100%",
          height: "auto",
        }}
      />
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
