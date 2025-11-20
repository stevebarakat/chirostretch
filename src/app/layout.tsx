import type { Metadata } from "next";
import { Poppins, Montserrat } from "next/font/google";
import "@/styles/reset.css";
import "@/styles/tokens.css";
import "@/styles/globals.css";
import "@/styles/swiper.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { wpQuery } from "@app/lib/wp/graphql";
import {
  LAYOUT_QUERY,
  type LayoutQueryResponse,
} from "@app/lib/wp/queries/layout";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

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
  const data = await wpQuery<LayoutQueryResponse>(LAYOUT_QUERY);
  const logo = data?.logo;

  return (
    <html lang="en" className={`${poppins.variable} ${montserrat.variable}`}>
      <body>
        <Navbar logo={logo} />
        {children}
        <Footer logo={logo} />
      </body>
    </html>
  );
}
