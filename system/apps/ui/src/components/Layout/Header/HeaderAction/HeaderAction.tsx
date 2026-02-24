"use client";

import { usePathname } from "next/navigation";
import { CartBadge } from "@/components/Cart";
import { LocationSearchTrigger } from "../LocationSearchTrigger";

const SHOP_ROUTES = ["/shop", "/products", "/cart", "/checkout"];

function isShopRoute(pathname: string) {
  return SHOP_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );
}

export default function HeaderAction() {
  const pathname = usePathname();

  if (isShopRoute(pathname)) {
    return <CartBadge variant="inverse" />;
  }

  return <LocationSearchTrigger />;
}
