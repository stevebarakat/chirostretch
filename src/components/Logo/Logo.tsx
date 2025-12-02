import Link from "next/link";
import Image from "next/image";
import logo from "/public/images/logo.svg";
import "./logo.css";

export default function Logo({ isMobile }: { isMobile?: boolean }) {
  return (
    <div className={isMobile ? "mobile logo" : "logo"}>
      <Link href="/" passHref>
        <Image
          priority
          src={logo}
          alt="North Florida Chiropractic Physical Therapy"
          width={249}
          height={71}
        />
      </Link>
    </div>
  );
}
