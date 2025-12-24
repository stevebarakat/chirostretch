"use client";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import Link from "next/link";
import { useRef, useState } from "react";
import { FaCaretDown } from "react-icons/fa";
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
};

function TopMenuItem({ item }: TopMenuItemProps) {
  const dropdownButton = item?.childItems?.nodes;
  const isDropdownButton = dropdownButton && dropdownButton.length > 0;
  const ref = useRef<HTMLLIElement>(null);
  const [isActive, setIsActive] = useState(false);

  useOnClickOutside(ref, () => setIsActive(false));

  return (
    <li ref={ref} style={{ position: "relative" }}>
      {!isDropdownButton ? (
        <Link href={item.uri} passHref className={styles.topMenuLink}>
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
            isActive ? styles.topMenuDropdown : `${styles.topMenuDropdown} sr-only`
          }
        >
          {item.childItems?.nodes.map((child) => (
            <li key={child.id}>
              <Link href={child.uri} passHref className={styles.topMenuLink}>
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
};

export default function TopMenu({ menuItems }: TopMenuProps) {
  return (
    <ul className={styles.topMenu}>
      {menuItems?.map((item) => (
        <TopMenuItem key={item.id} item={item} />
      ))}
    </ul>
  );
}
