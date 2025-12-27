"use client";

// eslint-disable-next-line no-restricted-imports
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Hamburger from "hamburger-react";
import { ChevronDown, CircleUser } from "lucide-react";
import { Logo } from "@/components/Logo";
import { LocationSearchTrigger } from "../LocationSearchTrigger";
import styles from "../Header.module.css";
import { VisuallyHidden } from "@/components/UI/VisuallyHidden";

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
    <li onMouseLeave={() => setIsActive(false)}>
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

function AuthMenuItem({ onNavigate }: { onNavigate?: () => void }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Reason this component must use useEffect:
  // - Syncing with external API (auth status endpoint) on component mount
  // - Server Components cannot handle client-side API calls
  // - Also syncs on window focus to detect auth state changes in other tabs
  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch("/api/auth/status");
        const data = await response.json();
        setAuthenticated(data.authenticated ?? false);
      } catch {
        setAuthenticated(false);
      }
    }

    checkAuth();

    const handleFocus = () => checkAuth();
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [pathname]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Logout failed");

      router.push("/login");
      router.refresh();
    } catch {
      router.push("/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (authenticated === null) {
    return null;
  }

  if (!authenticated) {
    return (
      <Link
        href="/login"
        className={styles.topBarAuthLink}
        onClick={onNavigate}
      >
        Login
      </Link>
    );
  }

  return (
    <div onMouseLeave={() => setIsOpen(false)}>
      <button
        type="button"
        className={styles.topMenuBtnLink}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <VisuallyHidden as="span">My Account</VisuallyHidden>
        <CircleUser aria-hidden="true" />
      </button>
      <ul
        className={
          isOpen
            ? `${styles.topMenuDropdown} ${styles.topMenuDropdownOpen}`
            : styles.topMenuDropdown
        }
      >
        <li>
          <Link
            href="/dashboard"
            className={styles.topMenuLink}
            onClick={() => {
              setIsOpen(false);
              onNavigate?.();
            }}
          >
            Dashboard
          </Link>
        </li>
        <li>
          <button
            type="button"
            className={styles.topMenuLink}
            onClick={handleLogout}
            disabled={isLoggingOut}
            style={{
              width: "100%",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            {isLoggingOut ? "Logging out..." : "Log Out"}
          </button>
        </li>
      </ul>
    </div>
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
