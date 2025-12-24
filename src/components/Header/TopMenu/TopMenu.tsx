"use client";
import { useState } from "react";
import Link from "next/link";
import Hamburger from "hamburger-react";
import { FaCaretDown } from "react-icons/fa";
import { Logo } from "@/components/Logo";
import { AccountMenu } from "../AccountMenu";
import styles from "../Header.module.css";

type MenuItem = {
  id: string;
  uri: string;
  label: string;
  childItems?: {
    nodes: MenuItem[];
  };
};

type TopMenuItemProps = {
  item: MenuItem;
  onNavigate?: () => void;
};

function TopMenuItem({ item, onNavigate }: TopMenuItemProps) {
  const dropdownButton = item?.childItems?.nodes;
  const isDropdownButton = dropdownButton && dropdownButton.length > 0;
  const [isActive, setIsActive] = useState(false);

  return (
    <li style={{ position: "relative" }} onMouseLeave={() => setIsActive(false)}>
      {!isDropdownButton ? (
        <Link
          href={item.uri}
          passHref
          className={styles.topMenuLink}
          onClick={onNavigate}
        >
          {item.label}
        </Link>
      ) : (
        <button
          type="button"
          className={styles.topMenuBtnLink}
          onClick={() => setIsActive((prev) => !prev)}
          aria-expanded={isActive}
          aria-haspopup="true"
        >
          {item.label}
          <FaCaretDown aria-hidden="true" style={{ marginLeft: "0.25rem" }} />
        </button>
      )}

      {isDropdownButton && (
        <ul
          className={
            isActive
              ? styles.topMenuDropdown
              : `${styles.topMenuDropdown} sr-only`
          }
        >
          {item.childItems?.nodes.map((child) => (
            <li key={child.id}>
              <Link
                href={child.uri}
                passHref
                className={styles.topMenuLink}
                onClick={() => {
                  setIsActive(false);
                  onNavigate?.();
                }}
              >
                {child.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

type TopMenuProps = {
  menuItems?: MenuItem[];
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

export default function TopMenu({ menuItems, logo }: TopMenuProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className={styles.topBarContainer}>
      <div className={styles.topBarMobileOnly}>
        <Logo isMobile={true} logo={logo} />
      </div>

      <button
        type="button"
        className={styles.topBarHamburger}
        onClick={() => setMobileOpen((prev) => !prev)}
        aria-expanded={mobileOpen}
        aria-controls="top-navigation"
        aria-label="Toggle navigation menu"
      >
        <Hamburger label="toggle menu" toggled={mobileOpen} size={20} />
      </button>

      <nav
        id="top-navigation"
        className={styles.topNav}
        aria-label="Top navigation"
        style={
          {
            "--topNavToggle": mobileOpen ? "translateX(0)" : "translateX(-100%)",
          } as React.CSSProperties
        }
      >
        <div className={styles.topNavContainer}>
          <div className={styles.topBarMobileOnly}>
            <Logo isMobile={false} logo={logo} />
          </div>
          <ul className={styles.topMenu}>
            {menuItems?.map((item) => (
              <TopMenuItem
                key={item.id}
                item={item}
                onNavigate={() => setMobileOpen(false)}
              />
            ))}
          </ul>
          <div className={styles.topBarMobileOnly}>
            <AccountMenu />
          </div>
        </div>
      </nav>
    </div>
  );
}
