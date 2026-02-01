import Image from "next/image";
import { proxyCmsUrl } from "@/utils/image-helpers";
import styles from "./Button.module.css";

type IconNode = {
  sourceUrl?: string;
  altText?: string;
  mediaDetails?: {
    width?: number;
    height?: number;
  };
};

type ButtonIconProps = {
  icon?: IconNode;
};

export function ButtonIcon({ icon }: ButtonIconProps) {
  if (!icon?.sourceUrl) return null;

  const proxyUrl = proxyCmsUrl(icon.sourceUrl);

  return (
    <span
      className={styles.buttonIcon}
      style={
        {
          "--icon-url": `url(${proxyUrl})`,
        } as React.CSSProperties
      }
    >
      <Image
        src={proxyUrl}
        alt={icon.altText || ""}
        width={icon.mediaDetails?.width || 20}
        height={icon.mediaDetails?.height || 20}
        className={styles.buttonIconImage}
      />
    </span>
  );
}
