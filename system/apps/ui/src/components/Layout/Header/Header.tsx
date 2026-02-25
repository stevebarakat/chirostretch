import { TopMenu } from "./TopMenu";
import { HeaderAction } from "./HeaderAction";
import styles from "./Header.module.css";
import type { MenuItem } from "@/lib/graphql/queries";
import { Logo } from "@/components/Logo";
import AnnouncementBar from "@/components/Layout/AnnouncementBar/AnnouncementBar";

type HeaderProps = {
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
  topMenuItems?: MenuItem[];
};

export default function Header({ logo, topMenuItems }: HeaderProps) {
  return (
    <header className={styles.siteHeader}>
      <AnnouncementBar
        message={
          <>
            Free shipping on orders over $50 —{" "}
            <strong>Save big on today&apos;s deal!</strong>
          </>
        }
      />
      <div className={styles.topBar}>
        <TopMenu menuItems={topMenuItems} logo={logo} />
      </div>
      <div className={styles.headerBar}>
        <div className={styles.headerContainer}>
          <Logo isMobile={false} logo={logo} />
          <HeaderAction />
        </div>
      </div>
    </header>
  );
}
