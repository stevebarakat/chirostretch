import Link from "next/link";
import Image from "next/image";
import styles from "./Logo.module.css";

type LogoProps = {
  isMobile?: boolean;
  logo?: {
    altText?: string;
    sourceUrl?: string;
    srcSet?: string;
    sizes?: string;
    mediaDetails?: {
      width?: number;
      height?: number;
    };
  };
};

export default function Logo({ isMobile = false, logo }: LogoProps) {
  const logoSrc = logo?.sourceUrl || "/images/logo.png";
  const logoAlt = logo?.altText || "ChiroStretch Logo";
  const logoWidth = logo?.mediaDetails?.width || 400;
  const logoHeight = logo?.mediaDetails?.height || 63;

  if (!logoSrc)
    return (
      <div
        className={isMobile ? `${styles.mobile} ${styles.logo}` : styles.logo}
      >
        <div>
          <span className={styles.logoChiro}>Chiro</span>
          <span className={styles.logoStretch}>Stretch</span>
        </div>
      </div>
    );

  return (
    <div
      className={isMobile ? `${styles.mobile} ${styles.logo}` : styles.logo}
      style={{ paddingLeft: "var(--spacing-md)" }}
    >
      <Link href="/" aria-label="ChiroStretch - Go to homepage">
        <Image
          priority
          src={logoSrc}
          alt={logoAlt}
          width={logoWidth}
          height={logoHeight}
        />
      </Link>
    </div>
  );
}
