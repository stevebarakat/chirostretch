import Link from "next/link";
import Image from "next/image";
import "./logo.css";

const logo = "/images/logo.svg";

export default function Logo({ isMobile }: { isMobile?: boolean }) {
  return (
    <div className={isMobile ? "mobile logo" : "logo"}>
      <Link href="/" passHref>
        <Image
          priority
          src={logo as string}
          alt="North Florida Chiropractic Physical Therapy"
          width={249}
          height={71}
        />
      </Link>
    </div>
  );
}
