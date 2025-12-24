"use client";
import Link from "next/link";
import { useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import styles from "@/components/Header/Header.module.css";

type MenuItem = {
  id: string;
  uri: string;
  label: string;
  childItems?: {
    nodes: MenuItem[];
  };
};

type MenuType = {
  item: MenuItem;
};

export default function Menu({ item }: MenuType) {
  const dropdownButton = item?.childItems?.nodes;
  const isDropdownButton = dropdownButton && dropdownButton.length > 0;
  const [isActive, setIsActive] = useState(false);

  return (
    <li onMouseLeave={() => setIsActive(false)}>
      {!isDropdownButton ? (
        <Link href={item.uri} passHref className={styles.link}>
          {item.label}
        </Link>
      ) : (
        <button
          type="button"
          className={styles.btnLink}
          onClick={() => setIsActive((prev) => !prev)}
          aria-expanded={isActive}
          aria-haspopup="true"
        >
          {item.label}
          <FaCaretDown aria-hidden="true" />
        </button>
      )}

      {item.childItems?.nodes.length! > 0 && (
        <ul
          className={isActive ? styles.dropdown : `${styles.dropdown} sr-only`}
        >
          {item.childItems?.nodes.map((child) => (
            <li key={child.id} className={styles.dropdownItem}>
              <Link href={child.uri} passHref className={styles.link}>
                {child.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}
