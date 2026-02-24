import type { Metadata } from "next";
import { Poppins, Montserrat } from "next/font/google";
import "@/styles/reset.css";
import "@/styles/tokens.css";
import "@/styles/globals.css";
import { Header, Footer } from "@/components/Layout";
import { CartProvider } from "@/components/Cart";
import { ToastProvider, ToastListener } from "@/components/Primitives";
import { ChatWidget } from "@/components/ai/ChatWidget";
import { wpQuery, CACHE_TAGS } from "@/lib/cms/graphql";
import {
  LAYOUT_QUERY,
  type LayoutQueryResponse,
  type MenuItem,
} from "@/lib/graphql/queries";
import { getSiteConfig } from "@/config";

const WP_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  preload: true,
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["600", "700"],
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
  let topMenuItems: MenuItem[] | undefined;

  try {
    const data = await wpQuery<LayoutQueryResponse>(
      LAYOUT_QUERY,
      {},
      {
        revalidate: 3600,
        tags: [CACHE_TAGS.menus, CACHE_TAGS.options, CACHE_TAGS.layout],
      }
    );
    logo = data?.logo;
    topMenuItems = data?.topMenu?.menuItems?.nodes;

    if (!data?.topMenu) {
      console.warn(
        "Top menu not found. Expected menu slug: 'main-menu'. Make sure a menu with this slug exists in WordPress."
      );
    }
  } catch (error) {
    console.error("Failed to fetch layout data from WordPress:", error);
    logo = undefined;
    topMenuItems = undefined;
  }

  return (
    <html
      lang="en"
      className={`${poppins.variable} ${montserrat.variable}`}
      data-scroll-behavior="smooth"
    >
      <head>
        <link rel="dns-prefetch" href={WP_URL} />
        <link rel="preconnect" href={WP_URL} crossOrigin="anonymous" />
        {/* Cloudinary for blur placeholders */}
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        {/* Algolia search (uses app ID subdomain) */}
        <link rel="preconnect" href="https://algolia.net" />
        <link rel="dns-prefetch" href="https://algolia.net" />
      </head>
      <body>
        <ToastProvider>
          <CartProvider>
            <Header logo={logo} topMenuItems={topMenuItems} />
            <main>{children}</main>
            <Footer logo={logo} />
            <ChatWidget />
          </CartProvider>
          <ToastListener />
        </ToastProvider>
      </body>
    </html>
  );
}
