"use client";

// eslint-disable-next-line no-restricted-imports
import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { User, ChevronDown } from "lucide-react";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import styles from "./AccountMenu.module.css";

export default function AccountMenu() {
  const router = useRouter();
  const pathname = usePathname();
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useOnClickOutside(ref, () => setIsOpen(false));

  // Reason this component must use useEffect:
  // - Syncing with external API (auth status endpoint) on component mount
  // - Server Components cannot handle client-side API calls
  // - This is a side effect that must run after mount to check authentication state
  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch("/api/auth/status");
        const data = await response.json();
        setAuthenticated(data.authenticated ?? false);
      } catch (error) {
        console.error("Failed to check auth status:", error);
        setAuthenticated(false);
      }
    }

    checkAuth();

    // Also check on window focus in case auth state changed in another tab/window
    const handleFocus = () => {
      checkAuth();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [pathname]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
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
      <Link href="/login" className={styles.accountLink}>
        <User size={20} aria-hidden="true" />
        <span>Login</span>
      </Link>
    );
  }

  return (
    <div ref={ref} className={styles.accountMenu}>
      <button
        type="button"
        className={styles.accountButton}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <User size={20} aria-hidden="true" />
        <span>My Account</span>
        <ChevronDown
          size={16}
          className={styles.chevron}
          aria-hidden="true"
        />
      </button>
      <ul
        className={isOpen ? styles.dropdown : `${styles.dropdown} sr-only`}
        role="menu"
      >
        <li className={styles.dropdownItem}>
          <Link
            href="/dashboard"
            className={styles.dropdownLink}
            role="menuitem"
            onClick={() => setIsOpen(false)}
          >
            Dashboard
          </Link>
        </li>
        <li className={styles.dropdownItem}>
          <button
            type="button"
            className={styles.dropdownLink}
            role="menuitem"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? "Logging out..." : "Log Out"}
          </button>
        </li>
      </ul>
    </div>
  );
}

