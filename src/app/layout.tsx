import type { Metadata } from "next";
import { Poppins, Montserrat } from "next/font/google";
import "@/styles/reset.css";
import "@/styles/tokens.css";
import "@/styles/globals.css";
import "@/styles/swiper.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { wpQuery } from "@app/_lib/wp/graphql";
import {
  LAYOUT_QUERY,
  type LayoutQueryResponse,
} from "@app/_lib/wp/queries/layout-query";

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
    icon: "/images/favicon.ico",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let logo;
  try {
    const data = await wpQuery<LayoutQueryResponse>(LAYOUT_QUERY, {}, 3600);
    logo = data?.logo;
  } catch (error) {
    console.warn("Failed to fetch layout data from WordPress:", error);
    logo = undefined;
  }

  return (
    <html lang="en" className={`${poppins.variable} ${montserrat.variable}`}>
      <head>
        <link rel="dns-prefetch" href="http://chirostretch-copy.local" />
        <link rel="dns-prefetch" href="https://chirostretch-copy.local" />
        <link
          rel="preconnect"
          href="http://chirostretch-copy.local"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://chirostretch-copy.local"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <Navbar logo={logo} />
        {children}
        <Footer logo={logo} />
      </body>
    </html>
  );
}
