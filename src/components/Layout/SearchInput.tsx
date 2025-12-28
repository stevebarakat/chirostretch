"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";
import SearchModal from "@/components/Search/SearchModal";
import styles from "./SearchInput.module.css";

function getSearchConfig(pathname: string) {
  const path = pathname.toLowerCase();

  if (path.startsWith("/events")) {
    return {
      placeholder: "Search events...",
      ariaLabel: "Search events",
    };
  }

  if (
    path.startsWith("/blog") ||
    path.startsWith("/articles") ||
    path.startsWith("/insights") ||
    path.startsWith("/posts") ||
    path.startsWith("/category")
  ) {
    return {
      placeholder: "Search articles...",
      ariaLabel: "Search articles",
    };
  }

  if (path.startsWith("/locations")) {
    return {
      placeholder: "Search locations...",
      ariaLabel: "Search locations",
    };
  }

  if (
    path.startsWith("/shop") ||
    path.startsWith("/cart") ||
    path.startsWith("/checkout") ||
    path.startsWith("/products")
  ) {
    return {
      placeholder: "Search products...",
      ariaLabel: "Search products",
    };
  }

  return {
    placeholder: "Search locations...",
    ariaLabel: "Search locations",
  };
}

export default function SearchInput() {
  const pathname = usePathname();
  const { placeholder, ariaLabel } = getSearchConfig(pathname);
  const [isModalOpen, setIsModalOpen] = useState(false);

  function handleInputClick() {
    setIsModalOpen(true);
  }

  function handleClose() {
    setIsModalOpen(false);
  }

  return (
    <>
      <div className={styles.search}>
        <Search className={styles.searchIcon} size={20} aria-hidden="true" />
        <input
          type="search"
          placeholder={placeholder}
          className={styles.searchInput}
          aria-label={ariaLabel}
          onClick={handleInputClick}
          readOnly
        />
      </div>
      <SearchModal isOpen={isModalOpen} onClose={handleClose} />
    </>
  );
}
