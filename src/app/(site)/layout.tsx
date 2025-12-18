import type { Metadata } from "next";
import { headers } from "next/headers";
import { Poppins, Montserrat } from "next/font/google";
import "@/styles/reset.css";
import "@/styles/tokens.css";
import "@/styles/globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/layout";
import { CartProvider } from "@/components/cart";
import { getServerCart } from "@/lib/woocommerce/getServerCart";
import { wpQuery } from "@app/_lib/wp/graphql";
import {
  LAYOUT_QUERY,
  type LayoutQueryResponse,
  type MenuItem,
} from "@/lib/graphql/queries";
import { getSiteConfig } from "@/config";

const WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL;

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  display: "swap",
  preload: true,
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
  preload: true,
});

export const revalidate = 300;

const siteConfig = getSiteConfig();

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: "ChiroStretch",
  description:
    "ChiroStretch - Global Mobility. Smarter Movement. Better Living.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "ChiroStretch",
    description:
      "ChiroStretch - Global Mobility. Smarter Movement. Better Living.",
    images: ["/images/og-image.jpg"],
  },
  twitter: {
    card: "summary_large_image",
  },
  icons: {
    icon: "/favicon.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let logo;
  let headerMenuItems: MenuItem[] | undefined;
  let footerMenuItems: MenuItem[] | undefined;

  try {
    const data = await wpQuery<LayoutQueryResponse>(LAYOUT_QUERY, {}, 3600);
    logo = data?.logo;
    headerMenuItems = data?.headerMenu?.menuItems?.nodes;
    footerMenuItems = data?.footerMenu?.menuItems?.nodes;

    if (!data?.headerMenu) {
      console.warn(
        "Header menu not found. Expected menu slug: 'main-menu'. Make sure a menu with this slug exists in WordPress and is assigned to a location."
      );
    } else if (!headerMenuItems || headerMenuItems.length === 0) {
      console.warn(
        `Header menu found (${
          data.headerMenu.name || "unknown"
        }) but has no menu items.`
      );
    }

    if (!data?.footerMenu) {
      console.warn(
        "Footer menu not found. Expected menu slug: 'footer-menu'. Make sure a menu with this slug exists in WordPress and is assigned to a location."
      );
    } else if (!footerMenuItems || footerMenuItems.length === 0) {
      console.warn(
        `Footer menu found (${
          data.footerMenu.name || "unknown"
        }) but has no menu items.`
      );
    }
  } catch (error) {
    console.error("Failed to fetch layout data from WordPress:", error);
    logo = undefined;
    headerMenuItems = undefined;
    footerMenuItems = undefined;
  }

  // Only fetch cart on shop-related pages where it's displayed or needed
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";
  const path = pathname.toLowerCase();
  const isShopPage =
    path.startsWith("/shop") ||
    path.startsWith("/cart") ||
    path.startsWith("/checkout") ||
    path.startsWith("/products");

  const cart = isShopPage ? await getServerCart() : null;

  return (
    <html lang="en" className={`${poppins.variable} ${montserrat.variable}`}>
      <head>
        <link rel="dns-prefetch" href={WORDPRESS_URL} />
        <link rel="preconnect" href={WORDPRESS_URL} crossOrigin="anonymous" />
        {/* Cloudinary for blur placeholders */}
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        {/* Algolia search (uses app ID subdomain) */}
        <link rel="preconnect" href="https://algolia.net" />
        <link rel="dns-prefetch" href="https://algolia.net" />
      </head>
      <body>
        <CartProvider initialCart={cart}>
          <Header logo={logo} menuItems={headerMenuItems} />
          {children}
          <Footer logo={logo} menuItems={footerMenuItems} />
        </CartProvider>
      </body>
    </html>
  );
}
