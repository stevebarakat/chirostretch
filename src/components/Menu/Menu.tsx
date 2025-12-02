import useOnClickOutside from "@/hooks/useOnClickOutside";
import Link from "next/link";
import { useRef, useState } from "react";
import { FaCaretDown } from "react-icons/fa";

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
          className="link"
        >
          {item.label}
        </Link>
      ) : (
        <button
          className="link"
          onClick={() => {
            setIsActive((isActive) => !isActive);
          }}
        >
          {item.label}
          <FaCaretDown />
        </button>
      )}

      {item.childItems?.nodes.length! > 0 && (
        <ul className={isActive ? "dropdown" : "dropdown sr-only"}>
          {item.childItems?.nodes.map((item) => {
            if (!setMobileOpen) return;
            return (
              <li key={item.id} className="dropdown-item">
                <Link
                  href={item.uri}
                  passHref
                  onPointerUp={() => setMobileOpen(false)}
                  className="link"
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
