import Link from "next/link";
import Image from "next/image";
import styles from "./Logo.module.css";

const fallbackLogo = "/images/logo.svg";

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

export default function Logo({ isMobile, logo }: LogoProps) {
  const logoSrc = logo?.sourceUrl || fallbackLogo;
  const logoAlt =
    logo?.altText || "North Florida Chiropractic Physical Therapy";
  const logoWidth = logo?.mediaDetails?.width || 249;
  const logoHeight = logo?.mediaDetails?.height || 71;

  return (
    <div className={isMobile ? `${styles.mobile} ${styles.logo}` : styles.logo}>
      <Link href="/" passHref>
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
