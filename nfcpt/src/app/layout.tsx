import "@/styles/normalize.css";
import "@/styles/variables.css";
import "@/styles/utils.css";
import "@/styles/globals.css";
import { inter, montserrat } from "./fonts";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { GoogleAnalytics } from "@next/third-parties/google";
import fetchQuery from "@/lib/fetch";

export default async function RootLayout({ children }: Children) {
  const data = await fetchQuery({
    queryType: "getFooterContent",
  });
  const { footerCall, footerBtn1, footerBtn2 } = data.upperFooter.options;
  const { contactInfo, officeHours } = data.lowFooter.lowerFooter;
  const homepageSettings = await fetchQuery({
    queryType: "getHomepageSettings",
  });
  const { googleAnalyticsId } = homepageSettings.customSEO.customSeoSettings;

  const footerContent = {
    footerCall,
    footerBtn1,
    footerBtn2,
    contactInfo,
    officeHours,
    socialMedia: data.lowFooter.lowerFooter.socialMedia,
  };

  const header = await fetchQuery({
    queryType: "getHierarchicalMenuBySlug",
    variables: { slug: "main-menu" },
  });
  const footer = await fetchQuery({
    queryType: "getHierarchicalMenuBySlug",
    variables: { slug: "footer-menu" },
  });
  const headerMenuItems = header?.menu?.menuItems?.nodes;
  const footerMenuItems = footer?.menu?.menuItems?.nodes;

  return (
    <>
      <GoogleAnalytics gaId={`G-${googleAnalyticsId}`} />
      <html lang="en" className={`${inter.variable} ${montserrat.variable}`}>
        <body id="top">
          <Header menuItems={headerMenuItems} />
          {children}
          <Footer menuItems={footerMenuItems} content={footerContent} />
        </body>
      </html>
    </>
  );
}
