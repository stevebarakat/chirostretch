"use client";

// eslint-disable-next-line no-restricted-imports
import { useState } from "react";
import Link from "next/link";
import Hamburger from "hamburger-react";
import { ChevronDown, CircleUser } from "lucide-react";
import { Logo } from "@/components/Logo";
import { LocationSearchTrigger } from "../LocationSearchTrigger";
import styles from "../Header.module.css";
import { VisuallyHidden } from "@/components/UI";

const WP_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "";

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

function isModalLink(url: string): boolean {
  return url.includes("?modal=") || url.startsWith("?");
}

function TopMenuItem({ item, onNavigate }: TopMenuItemProps) {
  const dropdownButton = item?.childItems?.nodes;
  const isDropdownButton = dropdownButton && dropdownButton.length > 0;
  const [isActive, setIsActive] = useState(false);
  const isModal = isModalLink(item.uri);

  return (
    <li
      onMouseEnter={() => isDropdownButton && setIsActive(true)}
      onMouseLeave={() => setIsActive(false)}
    >
      {!isDropdownButton ? (
        <Link
          href={item.uri}
          scroll={isModal ? false : undefined}
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
          <ChevronDown
            size={16}
            aria-hidden="true"
            style={{ marginLeft: "0.25rem" }}
          />
        </button>
      )}

      {isDropdownButton && (
        <ul
          className={
            isActive
              ? `${styles.topMenuDropdown} ${styles.topMenuDropdownOpen}`
              : styles.topMenuDropdown
          }
        >
          {item.childItems?.nodes.map((child) => (
            <li key={child.id}>
              <Link
                href={child.uri}
                scroll={isModalLink(child.uri) ? false : undefined}
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

function AuthMenuItem({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <a
      href={`${WP_URL}/my-account/`}
      className={styles.topBarAuthLink}
      onClick={onNavigate}
    >
      <VisuallyHidden as="span">My Account</VisuallyHidden>
      <CircleUser aria-hidden="true" />
    </a>
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
            "--topNavToggle": mobileOpen
              ? "translateX(0)"
              : "translateX(-100%)",
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
            <LocationSearchTrigger />
          </div>
        </div>
        <AuthMenuItem onNavigate={() => setMobileOpen(false)} />
      </nav>
    </div>
  );
}
