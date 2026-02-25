import { TopMenu } from "./TopMenu";
import { HeaderAction } from "./HeaderAction";
import styles from "./Header.module.css";
import type { MenuItem, AnnouncementBarData } from "@/lib/graphql/queries";
import { Logo } from "@/components/Logo";
import AnnouncementBarWrapper from "@/components/Layout/AnnouncementBar/AnnouncementBarWrapper";

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
  announcement?: AnnouncementBarData;
};

export default function Header({ logo, topMenuItems, announcement }: HeaderProps) {
  return (
    <header className={styles.siteHeader}>
      <AnnouncementBarWrapper announcement={announcement} />
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
