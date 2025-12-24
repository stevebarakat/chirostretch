import { Menu } from "@/components/Menu";
import { AccountMenu } from "./AccountMenu";
import { TopMenu } from "./TopMenu";
import styles from "./Header.module.css";
import type { MenuItem } from "@/lib/graphql/queries";
import { Logo } from "@/components/Logo";

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
  menuItems?: MenuItem[];
  topMenuItems?: MenuItem[];
  showMainNav?: boolean;
};

export default function Header({ logo, menuItems, topMenuItems, showMainNav = false }: HeaderProps) {
  return (
    <header className={styles.siteHeader}>
      <div className={styles.topBar}>
        <TopMenu menuItems={topMenuItems} logo={logo} />
      </div>
      <div className={styles.mainNav}>
        <nav id="main-navigation" className={styles.nav} aria-label="Main navigation">
          <div className={styles.navContainer}>
            <Logo isMobile={false} logo={logo} />
            {showMainNav && (
              <ul className={styles.menu}>
                {menuItems?.map((item) => (
                  <Menu key={item.id} item={item} />
                ))}
              </ul>
            )}
            <AccountMenu />
          </div>
        </nav>
      </div>
    </header>
  );
}
