import type { Metadata } from "next";
import { Poppins, Montserrat } from "next/font/google";
import "@/styles/reset.css";
import "@/styles/tokens.css";
import "@/styles/globals.css";
import "@/styles/swiper.css";
import { Footer, Header } from "@/components/layout";
import { CartProvider } from "@/components/cart";
import { getServerCart } from "@/lib/woocommerce/getServerCart";
import { wpQuery } from "@app/_lib/wp/graphql";
import {
  LAYOUT_QUERY,
  type LayoutQueryResponse,
  type MenuItem,
} from "@app/_lib/wp/queries/layout-query";

const WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL;

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
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

export const metadata: Metadata = {
  title: "ChiroStretch",
  description:
    "ChiroStretch - Global Mobility. Smarter Movement. Better Living.",
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
  } catch (error) {
    console.warn("Failed to fetch layout data from WordPress:", error);
    logo = undefined;
    headerMenuItems = undefined;
    footerMenuItems = undefined;
  }

  const cart = await getServerCart();

  return (
    <html lang="en" className={`${poppins.variable} ${montserrat.variable}`}>
      <head>
        <link rel="dns-prefetch" href={WORDPRESS_URL} />
        <link rel="preconnect" href={WORDPRESS_URL} crossOrigin="anonymous" />
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
