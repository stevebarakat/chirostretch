"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import styles from "./Menu.module.css";
import type { MenuItem } from "@app/_lib/wp/queries/layout-query";

type MenuProps = {
  item: MenuItem;
  onItemClick?: () => void;
  variant?: "header" | "footer";
};

export default function Menu({
  item,
  onItemClick,
  variant = "header",
}: MenuProps) {
  const dropdownItems = item?.childItems?.nodes;
  const hasDropdown = dropdownItems && dropdownItems.length > 0;
  const ref = useRef<HTMLLIElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useOnClickOutside(ref, () => setIsOpen(false));

  const handleClick = () => {
    if (onItemClick) {
      onItemClick();
    }
  };

  const itemClassName = `${styles.item} ${
    variant === "header" ? styles.itemHeader : ""
  }`;

  if (!hasDropdown) {
    return (
      <li className={itemClassName}>
        <Link href={item.uri} className={styles.link} onClick={handleClick}>
          {item.label}
        </Link>
      </li>
    );
  }

  return (
    <li ref={ref} className={itemClassName}>
      <button
        className={styles.button}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {item.label}
        <ChevronDown
          size={16}
          className={`${styles.icon} ${isOpen ? styles.iconOpen : ""}`}
          aria-hidden="true"
        />
      </button>
      {hasDropdown && (
        <ul
          className={`${styles.dropdown} ${isOpen ? styles.dropdownOpen : ""}`}
          role="menu"
        >
          {dropdownItems.map((childItem) => (
            <li key={childItem.id} className={styles.dropdownItem}>
              <Link
                href={childItem.uri}
                className={styles.dropdownLink}
                onClick={handleClick}
                role="menuitem"
              >
                {childItem.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}
