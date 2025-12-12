import useOnClickOutside from "@/hooks/useOnClickOutside";
import Link from "next/link";
import { useRef, useState } from "react";
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
  setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Menu({ item, setMobileOpen }: MenuType) {
  const dropdownButton = item?.childItems?.nodes;
  const isDropdownButton = dropdownButton && dropdownButton.length > 0;
  const ref = useRef<HTMLLIElement>(null);
  const [isActive, setIsActive] = useState(false);

  useOnClickOutside(ref, () => setIsActive(false));

  const headerMenu = (
    <li ref={ref}>
      {!isDropdownButton ? (
        <Link
          href={item.uri}
          passHref
          onPointerUp={() => setMobileOpen(false)}
          className={styles.link}
        >
          {item.label}
        </Link>
      ) : (
        <button
          type="button"
          className={styles.btnLink}
          onClick={() => {
            setIsActive((isActive) => !isActive);
          }}
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
          {item.childItems?.nodes.map((item) => {
            if (!setMobileOpen) return;
            return (
              <li key={item.id} className={styles.dropdownItem}>
                <Link
                  href={item.uri}
                  passHref
                  onPointerUp={() => setMobileOpen(false)}
                  className={styles.link}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </li>
  );
  return <>{headerMenu}</>;
}
