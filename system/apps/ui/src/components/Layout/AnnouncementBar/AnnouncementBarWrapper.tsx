"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import AnnouncementBar from "./AnnouncementBar";
import type { AnnouncementBarData } from "@/lib/graphql/queries";

export default function AnnouncementBarWrapper({
  announcement,
}: {
  announcement?: AnnouncementBarData;
}) {
  const pathname = usePathname();

  const showOn = Array.isArray(announcement?.showOn)
    ? announcement.showOn[0]
    : announcement?.showOn;

  const isVisible =
    !!announcement?.enabled &&
    !!announcement.message &&
    (showOn !== "shop" ||
      pathname.startsWith("/shop") ||
      pathname.startsWith("/products"));

  useEffect(() => {
    if (isVisible) {
      document.documentElement.setAttribute("data-announcement", "true");
    } else {
      document.documentElement.removeAttribute("data-announcement");
    }
  }, [isVisible]);

  if (!isVisible) return null;
  return <AnnouncementBar message={announcement!.message!} highlight={announcement!.highlight} />;
}
